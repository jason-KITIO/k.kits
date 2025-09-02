import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma"
import { supplierUpdateSchema } from "@/schema/supplier.schema";

export const GET = withPermission(PERMISSIONS.PRODUCT_READ)(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        supplierId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, supplierId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    const supplier = await prisma.supplier.findFirst({
      where: { id: supplierId, organizationId: store.organizationId },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Fournisseur introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  }
);

export const PUT = withPermission(PERMISSIONS.PRODUCT_UPDATE)(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        supplierId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, supplierId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    try {
      const json = await req.json();
      const data = supplierUpdateSchema.parse(json);

      const updated = await prisma.supplier.updateMany({
        where: { id: supplierId, organizationId: store.organizationId },
        data,
      });

      if (updated.count === 0) {
        return NextResponse.json(
          { error: "Fournisseur introuvable ou accès refusé" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Fournisseur mis à jour" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.PRODUCT_DELETE)(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        supplierId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, supplierId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    const deleted = await prisma.supplier.deleteMany({
      where: { id: supplierId, organizationId: store.organizationId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Fournisseur introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Fournisseur supprimé" });
  }
);
