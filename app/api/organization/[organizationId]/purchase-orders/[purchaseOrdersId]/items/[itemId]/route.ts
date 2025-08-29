import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

async function getItem(purchaseOrderId: string, itemId: string) {
  return await prisma.purchaseOrderItem.findUnique({
    where: { id: itemId },
    include: {
      purchaseOrder: true,
      product: true,
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const item = await getItem(params.id, params.itemId);
    if (!item || item.purchaseOrder.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Article non trouvé ou accès refusé." },
        { status: 404 }
      );

    const data = await request.json();

    const updated = await prisma.purchaseOrderItem.update({
      where: { id: params.itemId },
      data: {
        quantity: data.quantity ?? item.quantity,
        unitPrice: data.unitPrice ?? item.unitPrice,
        totalPrice:
          (data.quantity ?? item.quantity) * (data.unitPrice ?? item.unitPrice),
        notes: data.notes ?? item.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const item = await getItem(params.id, params.itemId);
    if (!item || item.purchaseOrder.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Article non trouvé ou accès refusé." },
        { status: 404 }
      );

    await prisma.purchaseOrderItem.delete({ where: { id: params.itemId } });

    return NextResponse.json({ message: "Article supprimé avec succès." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
