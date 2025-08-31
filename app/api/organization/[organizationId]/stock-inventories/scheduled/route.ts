import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const now = new Date();

    const scheduled = await prisma.stockInventory.findMany({
      where: {
        product: { organizationId },
        scheduledDate: { gt: now },
        status: { not: "COMPLETED" },
      },
      include: {
        product: true,
        warehouse: true,
        employee: true,
        performedByUser: true,
      },
      orderBy: {
        scheduledDate: "asc",
      },
    });

    return NextResponse.json(scheduled);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
