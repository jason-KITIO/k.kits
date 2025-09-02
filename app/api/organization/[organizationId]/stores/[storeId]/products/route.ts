import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { productCreateSchema } from "@/schema/product.schema";

// GET liste produits
export const GET = withPermission(PERMISSIONS.PRODUCT_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string, storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    // Validation store et organisation
    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
      select: { organizationId: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée" },
        { status: 404 }
      );
    }

    // Récupération des produits liés à l'organisation de la store
    const products = await prisma.product.findMany({
      where: { organizationId: store.organizationId, active: true },
      orderBy: { createdAt: "desc" },
      include: { category: true, supplier: true },
    });

    return NextResponse.json(products);
  }
);

// POST création produit
export const POST = withPermission(PERMISSIONS.PRODUCT_CREATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

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
      const data = productCreateSchema.parse(json);

      const product = await prisma.product.create({
        data: {
          ...data,
          color: data.color ?? "#FFFFFF", // valeur par défaut si nécessaire
          organizationId: store.organizationId,
          active: data.active ?? true,
        },
      });

      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
