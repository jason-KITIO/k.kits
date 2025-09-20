import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stockMovementRequestApprovalSchema } from "@/schema/stock-movement-request.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; requestId: string }> }
) {
  const { organizationId, storeId, requestId } = await params;

  try {
    const request = await prisma.stockMovementRequest.findFirst({
      where: {
        id: requestId,
        organizationId
      },
      include: {
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true, sku: true } }
      }
    });

    if (!request) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error("Erreur GET stock-movement-request:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; requestId: string }> }
) {
  const { organizationId, storeId, requestId } = await params;

  try {
    const body = await req.json();
    const parsed = stockMovementRequestApprovalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updatedRequest = await prisma.stockMovementRequest.update({
      where: {
        id: requestId
      },
      data: parsed.data,
      include: {
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true, sku: true } }
      }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Erreur PUT stock-movement-request:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}