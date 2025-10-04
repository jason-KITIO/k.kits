import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/get-user-from-cookie';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; warehouseId: string; orderId: string }> }
) {
  try {
    const sessionToken = await getUserFromCookie();
    if (!sessionToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur depuis le token
    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
    }

    const { organizationId, warehouseId, orderId } = await params;

    // Vérifier que l'utilisateur appartient à l'organisation
    const member = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer la commande avec ses articles
    const purchaseOrder = await prisma.purchaseOrder.findFirst({
      where: {
        id: orderId,
        warehouseId,
        warehouse: { organizationId },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    if (purchaseOrder.status === 'RECEIVED') {
      return NextResponse.json({ error: 'Commande déjà reçue' }, { status: 400 });
    }

    // Transaction pour mettre à jour le statut et le stock
    await prisma.$transaction(async (tx) => {
      // Mettre à jour le statut de la commande
      await tx.purchaseOrder.update({
        where: { id: orderId },
        data: { status: 'RECEIVED' },
      });

      // Mettre à jour le stock pour chaque article
      for (const item of purchaseOrder.items) {
        // Vérifier si le stock existe déjà
        const existingStock = await tx.stock.findFirst({
          where: {
            productId: item.productId,
            warehouseId,
          },
        });

        if (existingStock) {
          // Mettre à jour le stock existant
          await tx.stock.update({
            where: { id: existingStock.id },
            data: {
              quantity: existingStock.quantity + item.quantity,
              lastUpdated: new Date(),
            },
          });
        } else {
          // Créer un nouveau stock
          await tx.stock.create({
            data: {
              productId: item.productId,
              warehouseId,
              quantity: item.quantity,
              organizationId,
            },
          });
        }

        // Créer un mouvement de stock
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            toWarehouseId: warehouseId,
            type: 'IN',
            quantity: item.quantity,
            reason: 'PURCHASE_ORDER',
            reference: orderId,
            userId: session.user.id,
            organizationId,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la réception de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}