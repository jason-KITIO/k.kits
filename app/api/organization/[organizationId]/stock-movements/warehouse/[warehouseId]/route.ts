import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { warehouseId: string } }
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

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.warehouseId },
    });
    if (!warehouse || warehouse.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const movements = await prisma.stockMovement.findMany({
      where: { warehouseId: params.warehouseId },
      include: { product: true, employee: true, performedByUser: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movements);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
