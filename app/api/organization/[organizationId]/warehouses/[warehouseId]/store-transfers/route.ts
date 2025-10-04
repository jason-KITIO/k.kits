import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { warehouseToStoreTransferSchema } from "@/schema/warehouse-to-store-transfer.schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  const { organizationId, warehouseId } = await params;

  try {
    const body = await req.json();
    const parsed = warehouseToStoreTransferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const { toStoreId, items, reason } = parsed.data;

    const [warehouse, store] = await Promise.all([
      prisma.warehouse.findFirst({
        where: { id: warehouseId, organizationId }
      }),
      prisma.store.findFirst({
        where: { id: toStoreId, organizationId }
      })
    ]);

    if (!warehouse || !store) {
      return NextResponse.json({ error: "Entrepôt ou boutique non trouvé" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const movements = [];
      
      // Récupérer un utilisateur valide de l'organisation
      const user = await tx.user.findFirst({
        where: {
          organizationMembers: {
            some: { organizationId }
          }
        }
      });

      for (const item of items) {
        const warehouseStock = await tx.stock.findFirst({
          where: {
            productId: item.productId,
            warehouseId,
            organizationId
          }
        });

        if (!warehouseStock || warehouseStock.quantity < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${item.productId}`);
        }

        const movement = await tx.stockMovement.create({
          data: {
            productId: item.productId,
            fromWarehouseId: warehouseId,
            toStoreId,
            quantity: item.quantity,
            type: "TRANSFER",
            reason: reason || "Transfert entrepôt vers boutique",
            userId: user?.id || "system",
            organizationId
          }
        });

        await tx.stock.update({
          where: {
            id: warehouseStock.id
          },
          data: {
            quantity: { decrement: item.quantity },
            lastUpdated: new Date()
          }
        });

        // Chercher le stock existant pour la boutique
        const existingStoreStock = await tx.stock.findFirst({
          where: {
            productId: item.productId,
            storeId: toStoreId,
            warehouseId: null,
            organizationId
          }
        });

        if (existingStoreStock) {
          // Mettre à jour le stock existant
          await tx.stock.update({
            where: { id: existingStoreStock.id },
            data: {
              quantity: { increment: item.quantity },
              lastUpdated: new Date()
            }
          });
        } else {
          // Créer un nouveau stock pour la boutique
          await tx.stock.create({
            data: {
              productId: item.productId,
              storeId: toStoreId,
              quantity: item.quantity,
              organizationId
            }
          });
        }

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