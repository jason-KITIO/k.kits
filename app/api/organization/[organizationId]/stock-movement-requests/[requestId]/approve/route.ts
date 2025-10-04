import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; requestId: string }> }
) {
  const { organizationId, requestId } = await params;

  try {
    // Récupérer un utilisateur valide de l'organisation
    const orgMember = await prisma.organizationMember.findFirst({
      where: { organizationId },
      select: { userId: true }
    });
    
    if (!orgMember) {
      return NextResponse.json({ error: "Aucun utilisateur trouvé" }, { status: 400 });
    }
    
    const userId = orgMember.userId;

    await prisma.$transaction(async (tx) => {
      const request = await tx.stockMovementRequest.findUnique({
        where: { id: requestId, organizationId },
        include: { product: true }
      });

      if (!request || request.status !== 'PENDING') {
        throw new Error('Requête non valide');
      }

      // Mettre à jour le statut
      await tx.stockMovementRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          approvedBy: userId
        }
      });

      // Chercher le produit dans tous les entrepôts de l'organisation
      const warehouseStocks = await tx.stock.findMany({
        where: {
          productId: request.productId,
          warehouseId: { not: null },
          organizationId,
          quantity: { gte: request.quantity }
        },
        orderBy: { quantity: 'desc' }
      });

      if (warehouseStocks.length === 0) {
        // Vérifier le stock total disponible pour un message d'erreur informatif
        const totalStock = await tx.stock.aggregate({
          where: {
            productId: request.productId,
            warehouseId: { not: null },
            organizationId
          },
          _sum: { quantity: true }
        });
        const totalAvailable = totalStock._sum.quantity || 0;
        throw new Error(`Stock insuffisant dans tous les entrepôts. Stock total disponible: ${totalAvailable}, quantité demandée: ${request.quantity}`);
      }

      // Utiliser le premier entrepôt qui a suffisamment de stock
      const selectedWarehouse = warehouseStocks[0];

      // Réduire le stock de l'entrepôt sélectionné
      await tx.stock.update({
        where: { id: selectedWarehouse.id },
        data: { quantity: { decrement: request.quantity } }
      });

      // Augmenter le stock de la boutique
      const existingStoreStock = await tx.stock.findFirst({
        where: {
          productId: request.productId,
          storeId: request.toId,
          warehouseId: null,
          organizationId
        }
      });

      if (existingStoreStock) {
        await tx.stock.update({
          where: { id: existingStoreStock.id },
          data: { quantity: { increment: request.quantity } }
        });
      } else {
        await tx.stock.create({
          data: {
            productId: request.productId,
            warehouseId: null,
            storeId: request.toId,
            quantity: request.quantity,
            organizationId
          }
        });
      }

      // Créer un mouvement de stock
      await tx.stockMovement.create({
        data: {
          productId: request.productId,
          fromWarehouseId: selectedWarehouse.warehouseId,
          toStoreId: request.toId,
          quantity: request.quantity,
          type: 'TRANSFER',
          reference: `REQ-${request.id}`,
          reason: request.reason || 'Transfert approuvé',
          userId,
          organizationId
        }
      });
    });

    const updatedRequest = await prisma.stockMovementRequest.findUnique({
      where: { id: requestId }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Erreur approve request:", error);
    
    // Si c'est une erreur de stock insuffisant, retourner une erreur 400
    if (error instanceof Error && error.message.includes('Stock insuffisant')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}