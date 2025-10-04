import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const requests = await prisma.stockMovementRequest.findMany({
      where: {
        organizationId,
        OR: [
          { requestedBy: user.id },
          { toId: user.id },
          { fromId: user.id },
        ],
      },
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
            color: true,
          },
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Erreur lors de la récupération des requêtes:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}