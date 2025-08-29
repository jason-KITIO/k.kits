import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { warehouseId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.warehouseId },
    });
    if (!warehouse || warehouse.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const stock = await prisma.warehouseStock.findMany({
      where: { warehouseId: params.warehouseId },
      include: { product: true, location: true },
      orderBy: { productId: "asc" },
    });

    return NextResponse.json(stock);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { stockId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const data = await request.json();

    const whStock = await prisma.warehouseStock.findUnique({
      where: { id: params.stockId },
      include: { warehouse: true, product: true },
    });

    if (
      !whStock ||
      whStock.warehouse.organizationId !== organizationId ||
      whStock.product.organizationId !== organizationId
    ) {
      return NextResponse.json(
        { message: "Ligne de stock non trouvée ou accès refusé." },
        { status: 404 }
      );
    }

    const updated = await prisma.warehouseStock.update({
      where: { id: params.stockId },
      data: {
        quantity: data.quantity ?? whStock.quantity,
        reservedQty: data.reservedQty ?? whStock.reservedQty,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "Erreur serveur lors de la mise à jour du stock.",
      },
      { status: 500 }
    );
  }
}
