import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    return NextResponse.json(order.items);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
    });

    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    const data = await request.json();

    if (!data.productId || !data.quantity || !data.unitPrice) {
      return NextResponse.json(
        { message: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    // Vérifier que produit appartient organisation
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const item = await prisma.purchaseOrderItem.create({
      data: {
        purchaseOrderId: params.id,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalPrice: data.quantity * data.unitPrice,
        notes: data.notes ?? null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
