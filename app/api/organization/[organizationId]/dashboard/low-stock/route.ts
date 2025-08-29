import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/dashboard/low-stock:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Produits en stock faible
 *     description: Retourne les produits dont le stock est inférieur ou égal au seuil spécifié
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Seuil de stock faible
 *     responses:
 *       200:
 *         description: Liste des produits en stock faible
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                     description: Quantité totale en stock
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *       403:
 *         description: Organisation non sélectionnée
 *       500:
 *         description: Erreur serveur
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

    // Seuil par défaut, paramétrable via requête
    const threshold = Number(
      new URL(request.url).searchParams.get("threshold") ?? "10"
    );

    // Récupérer stock total par produit
    const groupedStock = await prisma.warehouseStock.groupBy({
      by: ["productId"],
      where: { product: { organizationId: orgId } },
      _sum: { quantity: true },
      orderBy: { productId: "asc" },
    });

    // Filtrer côté application les produits avec quantité <= seuil
    const lowStockFiltered = groupedStock.filter(
      (s): s is { productId: string; _sum: { quantity: number } } =>
        !!s._sum?.quantity && s._sum.quantity <= threshold
    );

    const products = await prisma.product.findMany({
      where: { id: { in: lowStockFiltered.map((s) => s.productId) } },
    });

    const result = lowStockFiltered.map((s) => ({
      productId: s.productId,
      quantity: s._sum.quantity,
      product: products.find((p) => p.id === s.productId),
    }));

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
