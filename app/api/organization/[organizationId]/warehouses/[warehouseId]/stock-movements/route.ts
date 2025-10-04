import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const stockMovementSchema = z.object({
  productId: z.string(),
  fromWarehouseId: z.string().nullable(),
  toWarehouseId: z.string().nullable(),
  fromStoreId: z.string().nullable(),
  toStoreId: z.string().nullable(),
  quantity: z.number().int(),
  type: z.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT", "SALE", "PURCHASE"]),
  reference: z.string().optional(),
  reason: z.string().optional(),
  userId: z.string(),
  organizationId: z.string(),
});

export async function GET(
  _req: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  try {
    const { organizationId, warehouseId } = await params;
    const movements = await prisma.stockMovement.findMany({
      where: {
        organizationId,
        OR: [{ fromWarehouseId: warehouseId }, { toWarehouseId: warehouseId }],
      },
      include: {
        product: true,
        user: true,
        fromWarehouse: true,
        toWarehouse: true,
        fromStore: true,
        toStore: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  try {
    const { organizationId, warehouseId } = await params;
    const json = await req.json();
    const data = stockMovementSchema.parse(json);

    // S'assurer que fromWarehouseId or toWarehouseId est bien warehouseId pour cohérence
    if (![data.fromWarehouseId, data.toWarehouseId].includes(warehouseId)) {
      return NextResponse.json(
        { error: "Mouvement non lié à cet entrepôt" },
        { status: 400 }
      );
    }

    // Vérifier le stock disponible pour les mouvements sortants
    if (data.fromWarehouseId) {
      const currentStock = await prisma.stock.findFirst({
        where: {
          productId: data.productId,
          warehouseId: data.fromWarehouseId,
          storeId: null,
          organizationId,
        },
      });

      if (!currentStock || currentStock.quantity < data.quantity) {
        const product = await prisma.product.findUnique({
          where: { id: data.productId },
          select: { name: true, sku: true }
        });
        return NextResponse.json(
          { 
            error: `Stock insuffisant pour le mouvement du produit ${product?.name || data.productId}`,
            details: {
              productId: data.productId,
              productName: product?.name,
              sku: product?.sku,
              requested: data.quantity,
              available: currentStock?.quantity || 0
            }
          },
          { status: 400 }
        );
      }
    }

    // Créer le mouvement et ajuster quantités en transaction
    const result = await prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          productId: data.productId,
          fromWarehouseId: data.fromWarehouseId,
          toWarehouseId: data.toWarehouseId,
          fromStoreId: data.fromStoreId,
          toStoreId: data.toStoreId,
          quantity: data.quantity,
          type: data.type,
          reference: data.reference,
          reason: data.reason,
          userId: data.userId,
          organizationId: data.organizationId,
        },
      });

      // Mettre à jour les stocks
      if (data.fromWarehouseId) {
        await tx.stock.updateMany({
          where: {
            productId: data.productId,
            warehouseId: data.fromWarehouseId,
            organizationId,
          },
          data: {
            quantity: { decrement: data.quantity },
            lastUpdated: new Date(),
          },
        });
      }

      if (data.toWarehouseId) {
        const existingStock = await tx.stock.findFirst({
          where: {
            productId: data.productId,
            warehouseId: data.toWarehouseId,
            storeId: null,
            organizationId,
          },
        });

        if (existingStock) {
          await tx.stock.update({
            where: { id: existingStock.id },
            data: {
              quantity: { increment: data.quantity },
              lastUpdated: new Date(),
            },
          });
        } else {
          await tx.stock.create({
            data: {
              productId: data.productId,
              warehouseId: data.toWarehouseId,
              storeId: null,
              quantity: data.quantity,
              reservedQuantity: 0,
              organizationId,
              lastUpdated: new Date(),
            },
          });
        }
      }

      return movement;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
