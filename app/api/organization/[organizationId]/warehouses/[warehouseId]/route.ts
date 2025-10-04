import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { warehouseUpdateSchema } from "@/schema/warehouse.schema";

export const GET = withPermission(PERMISSIONS.WAREHOUSE_READ)(
  async (
    _req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, organizationId },
      include: {
        manager: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Entrepôt introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(warehouse);
  }
);

export const PUT = withPermission(PERMISSIONS.WAREHOUSE_UPDATE)(
  async (
    req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    try {
      const json = await req.json();
      const data = warehouseUpdateSchema.parse(json);

      const updateResult = await prisma.warehouse.updateMany({
        where: { id: warehouseId, organizationId },
        data,
      });

      if (updateResult.count === 0) {
        return NextResponse.json(
          { error: "Entrepôt introuvable ou accès refusé" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Entrepôt mis à jour" });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 400 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.WAREHOUSE_DELETE)(
  async (
    req: NextRequest,
    {
      params,
      user,
    }: { 
      params: Promise<{ organizationId: string; warehouseId: string }>;
      user: any;
    }
  ) => {
    const { organizationId, warehouseId } = await params;

    try {
      const body = await req.json().catch(() => ({}));
      const { transferToWarehouseId, forceDelete } = body;

      // Vérifier si l'entrepôt existe
      const warehouse = await prisma.warehouse.findFirst({
        where: { id: warehouseId, organizationId },
      });

      if (!warehouse) {
        return NextResponse.json(
          { error: "Entrepôt introuvable" },
          { status: 404 }
        );
      }

      // Récupérer le stock
      const stockItems = await prisma.stock.findMany({
        where: { warehouseId, organizationId },
      });

      if (stockItems.length > 0) {
        if (forceDelete) {
          // Suppression forcée : supprimer tout le stock
          await prisma.$transaction(async (tx) => {
            // Supprimer le stock
            await tx.stock.deleteMany({
              where: { warehouseId, organizationId },
            });
            
            // Supprimer l'entrepôt
            await tx.warehouse.delete({
              where: { id: warehouseId },
            });
          });
        } else if (transferToWarehouseId) {
          // Transférer le stock vers un autre entrepôt
          const targetWarehouse = await prisma.warehouse.findFirst({
            where: { id: transferToWarehouseId, organizationId },
          });

          if (!targetWarehouse) {
            return NextResponse.json(
              { error: "Entrepôt de destination introuvable" },
              { status: 400 }
            );
          }

          // Vérifier la capacité si définie
          if (targetWarehouse.capacity) {
            const currentStock = await prisma.stock.aggregate({
              where: { warehouseId: transferToWarehouseId, organizationId },
              _sum: { quantity: true },
            });
            
            const transferQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalAfterTransfer = (currentStock._sum.quantity || 0) + transferQuantity;
            
            if (totalAfterTransfer > targetWarehouse.capacity) {
              return NextResponse.json(
                { 
                  error: "Capacité insuffisante dans l'entrepôt de destination",
                  details: `Capacité: ${targetWarehouse.capacity}, Stock actuel: ${currentStock._sum.quantity || 0}, Transfert: ${transferQuantity}`
                },
                { status: 400 }
              );
            }
          }

          await prisma.$transaction(async (tx) => {
            // Transférer chaque produit
            for (const stockItem of stockItems) {
              const existingStock = await tx.stock.findFirst({
                where: {
                  productId: stockItem.productId,
                  warehouseId: transferToWarehouseId,
                  organizationId,
                },
              });

              if (existingStock) {
                // Mettre à jour le stock existant
                await tx.stock.update({
                  where: { id: existingStock.id },
                  data: {
                    quantity: { increment: stockItem.quantity },
                    reservedQuantity: { increment: stockItem.reservedQuantity },
                    lastUpdated: new Date(),
                  },
                });
              } else {
                // Créer un nouveau stock
                await tx.stock.create({
                  data: {
                    productId: stockItem.productId,
                    warehouseId: transferToWarehouseId,
                    quantity: stockItem.quantity,
                    reservedQuantity: stockItem.reservedQuantity,
                    organizationId,
                    lastUpdated: new Date(),
                  },
                });
              }

              // Créer un mouvement de stock
              await tx.stockMovement.create({
                data: {
                  productId: stockItem.productId,
                  fromWarehouseId: warehouseId,
                  toWarehouseId: transferToWarehouseId,
                  quantity: stockItem.quantity,
                  type: "TRANSFER",
                  reason: `Transfert lors de la suppression de l'entrepôt ${warehouse.name}`,
                  organizationId,
                  userId: user.id,
                },
              });
            }

            // Supprimer l'ancien stock
            await tx.stock.deleteMany({
              where: { warehouseId, organizationId },
            });

            // Supprimer l'entrepôt
            await tx.warehouse.delete({
              where: { id: warehouseId },
            });
          });
        } else {
          // Aucune option spécifiée, retourner les options disponibles
          const availableWarehouses = await prisma.warehouse.findMany({
            where: { 
              organizationId, 
              id: { not: warehouseId },
              active: true 
            },
            select: { id: true, name: true, capacity: true },
          });

          return NextResponse.json(
            {
              error: "Cet entrepôt contient du stock",
              stockCount: stockItems.length,
              totalQuantity: stockItems.reduce((sum, item) => sum + item.quantity, 0),
              options: {
                transfer: availableWarehouses,
                forceDelete: true,
              },
            },
            { status: 409 }
          );
        }
      } else {
        // Pas de stock, suppression directe
        await prisma.warehouse.delete({
          where: { id: warehouseId },
        });
      }

      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Erreur DELETE warehouse", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);
