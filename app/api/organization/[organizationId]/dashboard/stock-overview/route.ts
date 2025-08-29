import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/dashboard/stock-overview:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Vue d'ensemble du stock
 *     description: Retourne un aperçu global des quantités en stock pour tous les produits
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Vue d'ensemble du stock récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: ID du produit
 *                   quantity:
 *                     type: integer
 *                     description: Quantité totale en stock
 *                     example: 150
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *       403:
 *         description: Organisation non sélectionnée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const orgId = request.cookies.get("selected-org-id")?.value;
    if (!orgId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, orgId);

    // Total quantité par produit dans l'organisation (sur tous warehouses)
    const stockOverview = await prisma.warehouseStock.groupBy({
      by: ["productId"],
      where: {
        product: { organizationId: orgId },
      },
      _sum: { quantity: true },
      orderBy: { productId: "asc" },
    });

    // Joindre les détails produit pour affichage
    const productDetails = await prisma.product.findMany({
      where: { id: { in: stockOverview.map((s) => s.productId) } },
    });

    const overview = stockOverview.map((s) => ({
      productId: s.productId,
      quantity: s._sum.quantity ?? 0,
      product: productDetails.find((p) => p.id === s.productId),
    }));

    return NextResponse.json(overview);
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
