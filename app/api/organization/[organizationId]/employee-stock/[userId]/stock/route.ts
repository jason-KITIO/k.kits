import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    // Vérifier que userId est dans l'organisation
    const member = await prisma.organizationMember.findFirst({
      where: { userId: params.userId, organizationId, active: true },
    });
    if (!member) {
      return NextResponse.json(
        { message: "Utilisateur non membre de l'organisation." },
        { status: 403 }
      );
    }

    const stock = await prisma.employeeStock.findMany({
      where: { userId: params.userId, product: { organizationId } },
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
