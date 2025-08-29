import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/products/low-stock:
 *   get:
 *     tags:
 *       - Products
 *     summary: Produits en stock faible
 *     description: Retourne les produits dont le stock est inférieur ou égal au seuil (5 par défaut)
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits en stock faible
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 allOf:
 *                   - $ref: '#/components/schemas/Product'
 *                   - type: object
 *                     properties:
 *                       warehouseStocks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             quantity:
 *                               type: integer
 *                             warehouseId:
 *                               type: string
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    // Trouver produits avec stock global faible (somme des stocks dans entrepôts)
    const products = await prisma.product.findMany({
      where: {
        organizationId: params.organizationId,
        active: true,
        warehouseStocks: {
          some: {
            quantity: {
              lte: 5, // seuil faible stock (à ajuster)
            },
          },
        },
      },
      orderBy: { name: "asc" },
      include: {
        warehouseStocks: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des produits en stock faible." },
      { status: 500 }
    );
  }
}
