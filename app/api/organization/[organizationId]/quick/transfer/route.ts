import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const orgId = request.cookies.get("selected-org-id")?.value;
    const userId = request.cookies.get("user-id")?.value;
    if (!orgId || !userId)
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    checkOrganization(request, orgId);

    const data = await request.json();

    if (
      !data.productId ||
      !data.quantity ||
      !data.sourceWarehouseId ||
      !data.destWarehouseId
    ) {
      return NextResponse.json(
        {
          message:
            "productId, quantity, sourceWarehouseId, destWarehouseId sont obligatoires.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== orgId) {
      return NextResponse.json(
        { message: "Produit introuvable dans l'organisation." },
        { status: 404 }
      );
    }

    const sourceStock = await prisma.warehouseStock.findFirst({
      where: { productId: data.productId, warehouseId: data.sourceWarehouseId },
    });

    if (!sourceStock || sourceStock.quantity < Number(data.quantity)) {
      return NextResponse.json(
        { message: "Stock insuffisant dans entrepôt source." },
        { status: 400 }
      );
    }

    await prisma.warehouseStock.update({
      where: { id: sourceStock.id },
      data: {
        quantity: sourceStock.quantity - Number(data.quantity),
        updatedAt: new Date(),
      },
    });

    let destStock = await prisma.warehouseStock.findFirst({
      where: { productId: data.productId, warehouseId: data.destWarehouseId },
    });

    if (destStock) {
      destStock = await prisma.warehouseStock.update({
        where: { id: destStock.id },
        data: {
          quantity: destStock.quantity + Number(data.quantity),
          updatedAt: new Date(),
        },
      });
    } else {
      destStock = await prisma.warehouseStock.create({
        data: {
          productId: data.productId,
          warehouseId: data.destWarehouseId,
          quantity: Number(data.quantity),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    await prisma.stockMovement.createMany({
      data: [
        {
          productId: data.productId,
          warehouseId: data.sourceWarehouseId,
          movementType: "TRANSFER_OUT",
          quantity: Number(data.quantity),
          performedBy: userId,
          createdAt: new Date(),
        },
        {
          productId: data.productId,
          warehouseId: data.destWarehouseId,
          movementType: "TRANSFER_IN",
          quantity: Number(data.quantity),
          performedBy: userId,
          createdAt: new Date(),
        },
      ],
    });

    return NextResponse.json({
      sourceStockUpdated: sourceStock,
      destStockUpdated: destStock,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
