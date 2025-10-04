import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stockMovementRequestCreateSchema } from "@/schema/stock-movement-request.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const requesterId = searchParams.get("requesterId");

  try {
    const where = {
      organizationId,
      ...(status && { status }),
      ...(requesterId && { requestedBy: requesterId })
    };

    const requests = await prisma.stockMovementRequest.findMany({
      where,
      include: {
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true, sku: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Erreur GET stock-movement-requests:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;

  try {
    const body = await req.json();
    const parsed = stockMovementRequestCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // Récupérer un utilisateur valide de l'organisation
    const user = await prisma.user.findFirst({
      where: {
        organizationMembers: {
          some: { organizationId }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Aucun utilisateur trouvé dans l'organisation" }, { status: 400 });
    }

    const request = await prisma.stockMovementRequest.create({
      data: {
        ...parsed.data,
        organizationId,
        status: "PENDING",
        requestedBy: user.id,
        fromType: "WAREHOUSE",
        toType: "EMPLOYEE_STOCK",
        fromId: "warehouse-default",
        toId: storeId
      },
      include: {
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true, sku: true } }
      }
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Erreur POST stock-movement-requests:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}