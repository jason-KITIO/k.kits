import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { warehouseToStoreTransferSchema } from "@/schema/warehouse-to-store-transfer.schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;

  try {
    const body = await req.json();
    const parsed = warehouseToStoreTransferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const { fromWarehouseId, items, reason } = parsed.data;

    // Vérifier que la boutique et l'entrepôt appartiennent à l'organisation
    const [store, warehouse] = await Promise.all([
      prisma.store.findFirst({
        where: { id: storeId, organizationId }
      }),
      prisma.warehouse.findFirst({
        where: { id: fromWarehouseId, organizationId }
      })
    ]);

    if (!store || !warehouse) {
      return NextResponse.json({ error: "Boutique ou entrepôt non trouvé" }, { status: 404 });
    }

    // Transaction pour effectuer le transfert
    const result = await prisma.$transaction(async (tx) => {
      const movements = [];

      for (const item of items) {
        // Vérifier le stock disponible dans l'entrepôt
        const warehouseStock = await tx.stock.findFirst({
          where: {
            productId: item.productId,
            warehouseId: fromWarehouseId,
            organizationId
          }
        });

        if (!warehouseStock || warehouseStock.quantity < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${item.productId}`);
        }

        // Créer le mouvement de stock
        const movement = await tx.stockMovement.create({
          data: {
            productId: item.productId,
            fromWarehouseId,
            toStoreId: storeId,
            quantity: item.quantity,
            type: "TRANSFER",
            reason: reason || "Transfert entrepôt vers boutique",
            userId: "temp-user-id",
            organizationId
          }
        });

        // Décrémenter le stock de l'entrepôt
        await tx.stock.update({
          where: {
            id: warehouseStock.id
          },
          data: {
            quantity: { decrement: item.quantity },
            lastUpdated: new Date()
          }
        });

        // Incrémenter le stock de la boutique
        await tx.stock.upsert({
          where: {
            productId_warehouseId_storeId_organizationId: {
              productId: item.productId,
              warehouseId: null,
              storeId,
              organizationId
            }
          },
          update: {
            quantity: { increment: item.quantity },
            lastUpdated: new Date()
          },
          create: {
            productId: item.productId,
            storeId,
            quantity: item.quantity,
            organizationId
          }
        });

        movements.push(movement);
      }

      return movements;
    });

    return NextResponse.json({ 
      success: true, 
      message: "Transfert effectué avec succès",
      movements: result 
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur transfert entrepôt vers boutique:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Erreur serveur" 
    }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;

  try {
    const transfers = await prisma.stockMovement.findMany({
      where: {
        organizationId,
        toStoreId: storeId,
        type: "TRANSFER",
        fromWarehouseId: { not: null }
      },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        fromWarehouse: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(transfers);
  } catch (error) {
    console.error("Erreur GET warehouse-transfers:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}