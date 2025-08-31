import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{$1}> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    // Vérifier que le fournisseur appartient bien à l'organisation
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier || supplier.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Fournisseur non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    // Récupérer les produits du fournisseur
    const products = await prisma.product.findMany({
      where: {
        supplierId: supplierId,
        organizationId: organizationId,
        active: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      {
        message:
          "Erreur serveur lors de la récupération des produits du fournisseur.",
      },
      { status: 500 }
    );
  }
}
