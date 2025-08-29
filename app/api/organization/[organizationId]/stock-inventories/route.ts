import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const inventories = await prisma.stockInventory.findMany({
      where: {
        product: { organizationId },
      },
      include: {
        product: true,
        warehouse: true,
        employee: true,
        performedByUser: true,
      },
      orderBy: {
        scheduledDate: "desc",
      },
    });

    return NextResponse.json(inventories);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const performedByUserId = request.cookies.get("user-id")?.value;
    if (!organizationId || !performedByUserId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const data = await request.json();

    if (
      !data.productId ||
      !data.expectedQty ||
      !data.actualQty ||
      !data.scheduledDate
    ) {
      return NextResponse.json(
        {
          message:
            "productId, expectedQty, actualQty et scheduledDate sont obligatoires.",
        },
        { status: 400 }
      );
    }

    // Vérifier que le produit appartient à l'organisation
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    // Vérifier l'existence de l'entrepôt s'il est donné
    if (data.warehouseId) {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: data.warehouseId },
      });
      if (!warehouse || warehouse.organizationId !== organizationId) {
        return NextResponse.json(
          { message: "Entrepôt non trouvé dans cette organisation." },
          { status: 404 }
        );
      }
    }

    // Vérifier l'employé si précisé
    if (data.userId) {
      const member = await prisma.organizationMember.findFirst({
        where: { userId: data.userId, organizationId, active: true },
      });
      if (!member) {
        return NextResponse.json(
          { message: "Employé non membre de l'organisation." },
          { status: 403 }
        );
      }
    }

    const inventory = await prisma.stockInventory.create({
      data: {
        productId: data.productId,
        warehouseId: data.warehouseId ?? null,
        userId: data.userId ?? null,
        expectedQty: data.expectedQty,
        actualQty: data.actualQty,
        difference: data.actualQty - data.expectedQty,
        notes: data.notes ?? null,
        status: "PENDING",
        performedBy: performedByUserId,
        scheduledDate: new Date(data.scheduledDate),
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
