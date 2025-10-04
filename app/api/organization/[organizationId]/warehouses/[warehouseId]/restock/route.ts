import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/get-user-from-cookie';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  try {
    const sessionToken = await getUserFromCookie();
    if (!sessionToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
    }

    const { organizationId, warehouseId } = await params;
    const body = await request.json();
    const { items } = body;

    const member = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const existingStock = await tx.stock.findFirst({
          where: {
            productId: item.productId,
            warehouseId,
          },
        });

        if (existingStock) {
          await tx.stock.update({
            where: { id: existingStock.id },
            data: {
              quantity: existingStock.quantity + item.quantity,
              lastUpdated: new Date(),
            },
          });
        } else {
          await tx.stock.create({
            data: {
              productId: item.productId,
              warehouseId,
              quantity: item.quantity,
              organizationId,
            },
          });
        }

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            toWarehouseId: warehouseId,
            type: 'IN',
            quantity: item.quantity,
            reason: 'MANUAL_RESTOCK',
            userId: session.user.id,
            organizationId,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du rechargement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
