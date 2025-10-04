import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  const { organizationId, warehouseId } = await params;

  try {
    const requests = await prisma.stockMovementRequest.findMany({
      where: {
        fromType: 'WAREHOUSE',
        fromId: warehouseId,
        organization: { id: organizationId }
      },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Erreur GET warehouse stock-movement-requests:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}