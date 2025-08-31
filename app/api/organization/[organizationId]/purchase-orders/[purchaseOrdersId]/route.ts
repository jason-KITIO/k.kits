import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

async function getOrder(purchaseOrdersId: string) {
  return prisma.purchaseOrder.findUnique({
    where: { id: purchaseOrdersId },
    include: {
      supplier: true,
      creator: true,
      items: true,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrdersId: string }> }
) {
  try {
    const { purchaseOrdersId } = await params;
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const order = await getOrder(purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrdersId: string }> }
) {
  try {
    const { purchaseOrdersId } = await params;
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const order = await getOrder(purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    const data = await request.json();

    const updated = await prisma.purchaseOrder.update({
      where: { id: purchaseOrdersId },
      data: {
        orderNumber: data.orderNumber ?? order.orderNumber,
        supplierId: data.supplierId ?? order.supplierId,
        status: data.status ?? order.status,
        orderDate: data.orderDate ? new Date(data.orderDate) : order.orderDate,
        expectedDate: data.expectedDate
          ? new Date(data.expectedDate)
          : order.expectedDate,
        receivedDate: data.receivedDate
          ? new Date(data.receivedDate)
          : order.receivedDate,
        totalAmount: data.totalAmount ?? order.totalAmount,
        notes: data.notes ?? order.notes,
        approvedBy: data.approvedBy ?? order.approvedBy,
        receivedBy: data.receivedBy ?? order.receivedBy,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}