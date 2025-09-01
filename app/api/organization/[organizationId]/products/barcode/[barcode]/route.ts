import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/products/barcode/{barcode}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Recherche par code-barres
 *     description: Trouve un produit par son code-barres
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         description: Code-barres du produit
 *         example: "1234567890123"
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé pour ce code-barres
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; barcode: string }> }
) {
  try {
    const { organizationId, barcode } = await params;
    checkOrganization(organizationId);

    const product = await prisma.product.findFirst({
      where: {
        organizationId,
        barcode,
        active: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message:
            "Produit non trouvé pour ce code-barres dans cette organisation.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la recherche par code-barres." },
      { status: 500 }
    );
  }
}
