import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée" },
        { status: 403 }
      );
    }
    checkOrganization(organizationId);

    const transfers = await prisma.stockTransfer.findMany({
      where: { status: "PENDING", product: { organizationId } },
      include: {
        product: true,
        sourceWarehouse: true,
        destWarehouse: true,
        requester: true,
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json(transfers);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
