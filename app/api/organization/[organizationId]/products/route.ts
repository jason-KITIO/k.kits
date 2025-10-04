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
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const products = await prisma.product.findMany({
      where: { organizationId, active: true },
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
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = productCreateSchema.parse(json);

      // Génération automatique du SKU au format KKP-001
      const lastProduct = await prisma.product.findFirst({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        select: { sku: true },
      });

      let nextNumber = 1;
      if (lastProduct?.sku) {
        const match = lastProduct.sku.match(/KKP-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
      const generatedSku = `KKP-${nextNumber.toString().padStart(3, '0')}`;

      // Extraire initialStock et warehouseId des données
      const { initialStock, warehouseId, ...productData } = data;

      const product = await prisma.product.create({
        data: {
          ...productData,
          sku: generatedSku,
          color: productData.color ?? "#FFFFFF",
          organizationId,
          active: productData.active ?? true,
        },
      });

      // Créer le stock initial si spécifié
      if (initialStock && initialStock > 0 && warehouseId) {
        await prisma.stock.create({
          data: {
            productId: product.id,
            warehouseId,
            quantity: initialStock,
            organizationId,
          },
        });
      }

      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      console.error("Erreur création produit:", error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ 
        error: "Erreur interne", 
        details: error instanceof Error ? error.message : "Erreur inconnue" 
      }, { status: 500 });
    }
  }
);