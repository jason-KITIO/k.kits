import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; productId: string }> }
) {
  try {
    const { organizationId, productId } = await params;
    checkOrganization(organizationId);

    const stock = await prisma.warehouseStock.findMany({
      where: { productId, product: { organizationId } },
      include: { product: true, warehouse: true },
    });

    return NextResponse.json(stock);
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}