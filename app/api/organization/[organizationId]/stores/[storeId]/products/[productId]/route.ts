import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma"
import { productUpdateSchema } from "@/schema/product.schema";


export const PUT = withPermission(PERMISSIONS.PRODUCT_UPDATE)(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        productId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, productId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée" },
        { status: 404 }
      );
    }

    try {
      const json = await req.json();
      const data = productUpdateSchema.parse(json);

      const updateResult = await prisma.product.updateMany({
        where: { id: productId, organizationId: store.organizationId },
        data,
      });

      if (updateResult.count === 0) {
        return NextResponse.json(
          { error: "Produit introuvable ou accès refusé" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Produit mis à jour" });
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
        productId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, productId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée" },
        { status: 404 }
      );
    }

    const deleteResult = await prisma.product.deleteMany({
      where: { id: productId, organizationId: store.organizationId },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Produit introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Produit supprimé" });
  }
);
