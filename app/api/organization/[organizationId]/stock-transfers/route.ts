import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { stockTransferSchema } from "@/schema/stock-transfer.schema";

export const POST = withPermission(PERMISSIONS.STOCK_TRANSFER)(
  async (
    req: NextRequest,
    {
      params,
      user,
    }: { 
      params: Promise<{ organizationId: string }>;
      user: any;
    }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = stockTransferSchema.parse(json);

      // Vérifier que les entrepôts existent
      const [fromWarehouse, toWarehouse] = await Promise.all([
        prisma.warehouse.findFirst({
          where: { id: data.fromWarehouseId, organizationId },
        }),
        prisma.warehouse.findFirst({
          where: { id: data.toWarehouseId, organizationId },
        }),
      ]);

      if (!fromWarehouse || !toWarehouse) {
        return NextResponse.json(
          { error: "Entrepôt source ou destination introuvable" },
          { status: 404 }
        );
      }

      // Vérifier le stock disponible
      const stockItems = await prisma.stock.findMany({
        where: {
          warehouseId: data.fromWarehouseId,
          productId: { in: data.items.map(item => item.productId) },
          organizationId,
        },
      });

      for (const item of data.items) {
        const stockItem = stockItems.find(s => s.productId === item.productId);
        if (!stockItem || stockItem.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Stock insuffisant pour le produit ${item.productId}` },
            { status: 400 }
          );
        }
      }

      // Vérifier la capacité de l'entrepôt de destination
      if (toWarehouse.capacity) {
        const currentStock = await prisma.stock.aggregate({
          where: { warehouseId: data.toWarehouseId, organizationId },
          _sum: { quantity: true },
        });
        
        const transferQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAfterTransfer = (currentStock._sum.quantity || 0) + transferQuantity;
        
        if (totalAfterTransfer > toWarehouse.capacity) {
          return NextResponse.json(
            { 
              error: "Capacité insuffisante dans l'entrepôt de destination",
              details: `Capacité: ${toWarehouse.capacity}, Stock actuel: ${currentStock._sum.quantity || 0}, Transfert: ${transferQuantity}`
            },
            { status: 400 }
          );
        }
      }

      // Effectuer le transfert
      await prisma.$transaction(async (tx) => {
        for (const item of data.items) {
          // Réduire le stock source
          await tx.stock.updateMany({
            where: {
              productId: item.productId,
              warehouseId: data.fromWarehouseId,
              organizationId,
            },
            data: {
              quantity: { decrement: item.quantity },
              lastUpdated: new Date(),
            },
          });

          // Augmenter le stock destination
          const existingStock = await tx.stock.findFirst({
            where: {
              productId: item.productId,
              warehouseId: data.toWarehouseId,
              organizationId,
            },
          });

          if (existingStock) {
            await tx.stock.update({
              where: { id: existingStock.id },
              data: {
                quantity: { increment: item.quantity },
                lastUpdated: new Date(),
              },
            });
          } else {
            await tx.stock.create({
              data: {
                productId: item.productId,
                warehouseId: data.toWarehouseId,
                quantity: item.quantity,
                reservedQuantity: 0,
                organizationId,
                lastUpdated: new Date(),
              },
            });
          }

          // Créer le mouvement de stock
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              fromWarehouseId: data.fromWarehouseId,
              toWarehouseId: data.toWarehouseId,
              quantity: item.quantity,
              type: "TRANSFER",
              reason: data.reason || "Transfert manuel",
              organizationId,
              userId: user.id,
            },
          });
        }
      });

      return NextResponse.json({ message: "Transfert effectué avec succès" });
    } catch (error) {
      console.error("Erreur POST stock-transfers", error);
      if (error instanceof Error && 'issues' in error) {
        return NextResponse.json(
          { error: "Données invalides", details: (error as any).issues },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);