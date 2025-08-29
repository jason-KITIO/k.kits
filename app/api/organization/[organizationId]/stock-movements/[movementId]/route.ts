import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { movementId: string } }
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

    const movement = await prisma.stockMovement.findUnique({
      where: { id: params.movementId },
      include: {
        product: true,
        warehouse: true,
        employee: true,
        performedByUser: true,
      },
    });

    if (!movement || movement.product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Mouvement non trouvé ou accès refusé." },
        { status: 404 }
      );
    }

    return NextResponse.json(movement);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
