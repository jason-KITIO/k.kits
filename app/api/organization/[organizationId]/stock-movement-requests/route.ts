import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params;

  try {
    const requests = await prisma.stockMovementRequest.findMany({
      where: {
        organizationId
      },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Enrichir avec les noms des entrepôts et boutiques
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const [warehouse, store] = await Promise.all([
          prisma.warehouse.findUnique({
            where: { id: request.fromId },
            select: { name: true }
          }),
          prisma.store.findUnique({
            where: { id: request.toId },
            select: { name: true }
          })
        ]);
        
        return {
          ...request,
          fromWarehouse: warehouse,
          toStore: store
        };
      })
    );

    return NextResponse.json(enrichedRequests);
  } catch (error) {
    console.error("Erreur GET stock-movement-requests:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}