import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

//   request: NextRequest,
//   { params }: { params: Promise<{ organizationId: string; warehouseId: string }> }
// ) {
//   try {
//     const { organizationId, warehouseId } = await params;
//     checkOrganization(organizationId);
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(organizationId);

    const data = await request.json();
    if (
      !data.warehouseId ||
      !data.productId ||
      typeof data.quantity !== "number"
    ) {
      return NextResponse.json(
        { message: "warehouseId, productId et quantity sont obligatoires." },
        { status: 400 }
      );
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
    });
    if (!warehouse || warehouse.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const uniqueWhere = data.locationId
      ? {
          productId: data.productId,
          warehouseId: data.warehouseId,
          locationId: data.locationId,
        }
      : {
          productId: data.productId,
          warehouseId: data.warehouseId,
        };

    let whStock = await prisma.warehouseStock.findFirst({
      where: uniqueWhere,
    });

    if (whStock) {
      whStock = await prisma.warehouseStock.update({
        where: { id: whStock.id },
        data: {
          quantity: data.quantity,
          reservedQty: data.reservedQty ?? whStock.reservedQty,
          lastUpdated: new Date(),
        },
      });
    } else {
      whStock = await prisma.warehouseStock.create({
        data: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          locationId: data.locationId ?? null,
          quantity: data.quantity,
          reservedQty: data.reservedQty ?? 0,
          lastUpdated: new Date(),
        },
      });
    }

    return NextResponse.json(whStock);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Erreur serveur lors de l’ajustement du stock.",
      },
      { status: 500 }
    );
  }
}
