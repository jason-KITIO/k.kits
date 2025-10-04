import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; requestId: string }> }
) {
  const { organizationId, storeId, requestId } = await params;

  try {
    const request = await prisma.stockMovementRequest.findFirst({
      where: {
        id: requestId,
        organizationId,
        status: "PENDING"
      }
    });

    if (!request) {
      return NextResponse.json({ error: "Requête non trouvée ou déjà traitée" }, { status: 404 });
    }

    const updatedRequest = await prisma.stockMovementRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        approvedBy: "temp-user-id"
      },
      include: {
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true, sku: true } }
      }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Erreur approbation requête:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}