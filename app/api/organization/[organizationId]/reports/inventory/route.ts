import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const orgId = request.cookies.get("selected-org-id")?.value;
    if (!orgId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(orgId);

    const inventories = await prisma.stockInventory.findMany({
      where: { product: { organizationId: orgId }, status: "COMPLETED" },
      include: { product: true, warehouse: true, employee: true },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json(inventories);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
