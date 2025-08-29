import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
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

    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const stockLines = await prisma.warehouseStock.findMany({
      where: { productId: params.productId },
      include: { warehouse: true, location: true },
      orderBy: { warehouseId: "asc" },
    });

    return NextResponse.json(stockLines);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "Erreur serveur lors de la récupération du stock du produit.",
      },
      { status: 500 }
    );
  }
}
