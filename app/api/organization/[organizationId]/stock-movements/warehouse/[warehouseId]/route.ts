import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  try {
    const { organizationId, warehouseId } = await params;
    checkOrganization(organizationId);

    const movements = await prisma.stockMovement.findMany({
      where: { warehouseId, warehouse: { organizationId } },
      include: { product: true, warehouse: true, user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movements);
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}