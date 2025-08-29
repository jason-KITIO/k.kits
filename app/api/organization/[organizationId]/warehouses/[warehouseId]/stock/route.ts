import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; warehouseId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.warehouseId },
    });

    if (!warehouse || warehouse.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const stock = await prisma.warehouseStock.findMany({
      where: { warehouseId: params.warehouseId },
      include: { product: true },
    });

    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération du stock de l’entrepôt." },
      { status: 500 }
    );
  }
}
