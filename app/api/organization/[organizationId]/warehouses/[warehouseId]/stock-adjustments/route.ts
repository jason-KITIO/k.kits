import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { stockAdjustmentSchema } from "@/schema/warehouse.schema";
import prisma from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/get-user-from-cookie";

export const POST = withPermission(PERMISSIONS.STOCK_ADJUST)(
  async (
    req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    try {
      const json = await req.json();
      const data = stockAdjustmentSchema.parse(json);
      const user = await getUserFromCookie();

      if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      // Vérifier le stock disponible pour les ajustements OUT
      if (data.type === "OUT") {
        const currentStock = await prisma.stock.findFirst({
          where: {
            productId: data.productId,
            warehouseId,
            storeId: null,
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
        // Créer le mouvement de stock
        const movement = await tx.stockMovement.create({
          data: {
            productId: data.productId,
            toWarehouseId: data.type === "IN" ? warehouseId : undefined,
            fromWarehouseId: data.type === "OUT" ? warehouseId : undefined,
            quantity: Math.abs(data.quantity),
            type: data.type,
            reference: data.reference,
            reason: data.reason,
            userId: user,
            organizationId,
          },
        });

        // Ajuster le stock
        const quantityChange = data.type === "IN" ? data.quantity : -Math.abs(data.quantity);
        
        const existingStock = await tx.stock.findFirst({
          where: {
            productId: data.productId,
            warehouseId,
            storeId: null,
            organizationId,
          },
        });

        if (existingStock) {
          await tx.stock.update({
            where: { id: existingStock.id },
            data: {
              quantity: { increment: quantityChange },
              lastUpdated: new Date(),
            },
          });
        } else {
          await tx.stock.create({
            data: {
              productId: data.productId,
              warehouseId,
              storeId: null,
              quantity: Math.max(0, quantityChange),
              reservedQuantity: 0,
              organizationId,
              lastUpdated: new Date(),
            },
          });
        }

        return movement;
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 400 });
    }
  }
);