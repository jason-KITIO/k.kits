import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const requesterId = request.cookies.get("user-id")?.value;
    if (!organizationId || !requesterId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié" },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const transfers = await prisma.stockTransfer.findMany({
      where: { requestedBy: requesterId, product: { organizationId } },
      include: {
        product: true,
        sourceWarehouse: true,
        destWarehouse: true,
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json(transfers);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
