import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; userId: string }> }
) {
  try {
    const { organizationId, userId } = await params;
    checkOrganization(organizationId);

    // Vérifier que userId appartient à cette organisation
    const member = await prisma.organizationMember.findFirst({
      where: { userId: userId, organizationId, active: true },
    });
    if (!member) {
      return NextResponse.json(
        { message: "Utilisateur non membre de l'organisation." },
        { status: 403 }
      );
    }

    const stock = await prisma.employeeStock.findMany({
      where: { userId: userId, product: { organizationId } },
      include: { product: true },
      orderBy: { productId: "asc" },
    });

    return NextResponse.json(stock);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; userId: string }> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    const data = await request.json();

    const employeeStock = await prisma.employeeStock.findUnique({
      where: { id: data.employeeStockId },
      include: { product: true },
    });

    if (
      !employeeStock ||
      employeeStock.product.organizationId !== organizationId
    ) {
      return NextResponse.json(
        { message: "Ligne de stock non trouvée ou accès refusé." },
        { status: 404 }
      );
    }

    const updated = await prisma.employeeStock.update({
      where: { id: data.employeeStockId },
      data: {
        quantity: data.quantity ?? employeeStock.quantity,
        reservedQty: data.reservedQty ?? employeeStock.reservedQty,
        lastUpdated: new Date(),
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