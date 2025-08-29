import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const userId = request.cookies.get("user-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const stock = await prisma.employeeStock.findMany({
      where: { userId, product: { organizationId } },
      include: { product: true },
      orderBy: { productId: "asc" },
    });

    return NextResponse.json(stock);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
