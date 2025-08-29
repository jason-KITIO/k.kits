import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; supplierId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    // Vérifier que le fournisseur appartient bien à l'organisation
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.supplierId },
    });

    if (!supplier || supplier.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Fournisseur non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    // Récupérer les produits du fournisseur
    const products = await prisma.product.findMany({
      where: {
        supplierId: params.supplierId,
        organizationId: params.organizationId,
        active: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Erreur serveur lors de la récupération des produits du fournisseur.",
      },
      { status: 500 }
    );
  }
}
