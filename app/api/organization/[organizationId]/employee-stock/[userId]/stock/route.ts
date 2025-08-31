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

    const stock = await prisma.employeeStock.findMany({
      where: { userId: userId, product: { organizationId } },
      include: { product: true },
    });

    return NextResponse.json(stock);
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}