import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma"
import { customerUpdateSchema } from "@/schema/customer.schema";

export const GET = withPermission(PERMISSIONS.CUSTOMER_READ)(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        customerId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, customerId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerId, organizationId: store.organizationId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Client introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  }
);

export const PUT = withPermission(PERMISSIONS.CUSTOMER_UPDATE)(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        customerId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, customerId } = await params;

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
      const data = customerUpdateSchema.parse(json);

      const updateResult = await prisma.customer.updateMany({
        where: { id: customerId, organizationId: store.organizationId },
        data,
      });

      if (updateResult.count === 0) {
        return NextResponse.json(
          { error: "Client introuvable ou accès refusé" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Client mis à jour avec succès" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.CUSTOMER_DELETE)(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        customerId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, customerId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    const deleteResult = await prisma.customer.deleteMany({
      where: { id: customerId, organizationId: store.organizationId },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Client introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Client supprimé avec succès" });
  }
);
