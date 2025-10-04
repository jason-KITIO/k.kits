import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { stockAdjustmentSchema } from "@/schema/stock-movement.schema";

// POST - Ajustement rapide de stock
export const POST = withPermission(PERMISSIONS.STOCK_CREATE)(
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
        { error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    try {
      const json = await req.json();
      const data = stockAdjustmentSchema.parse(json);

      // Vérifier le stock disponible pour les ajustements négatifs
      if (data.quantity < 0) {
        const currentStock = await prisma.stock.findFirst({
          where: {
            productId: data.productId,
            storeId,
            organizationId,
          },
        });

        if (!currentStock || currentStock.quantity < Math.abs(data.quantity)) {
          const product = await prisma.product.findUnique({
            where: { id: data.productId },
            select: { name: true, sku: true }
          });
          return NextResponse.json(
            { 
              error: `Stock insuffisant pour l'ajustement du produit ${product?.name || data.productId}`,
              details: {
                productId: data.productId,
                productName: product?.name,
                sku: product?.sku,
                requested: Math.abs(data.quantity),
                available: currentStock?.quantity || 0
              }
            },
            { status: 400 }
          );
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        // Créer le mouvement d'ajustement
        const movement = await tx.stockMovement.create({
          data: {
            productId: data.productId,
            quantity: data.quantity,
            type: "ADJUSTMENT",
            toStoreId: storeId,
            reason: data.reason,
            organizationId,
            userId: req.headers.get("user-id") || "", // À adapter selon votre auth
          },
        });

        // Mettre à jour le stock
        await tx.stock.upsert({
          where: {
            productId_warehouseId_storeId_organizationId: {
              productId: data.productId,
              warehouseId: "",
              storeId,
              organizationId,
            },
          },
          update: {
            quantity: { increment: data.quantity },
            lastUpdated: new Date(),
          },
          create: {
            productId: data.productId,
            storeId,
            quantity: Math.max(0, data.quantity),
            organizationId,
          },
        });

        return movement;
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);