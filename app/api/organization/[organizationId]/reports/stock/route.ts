import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/reports/stock:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Rapport de stock détaillé
 *     description: Génère un rapport complet du stock avec détails des produits et entrepôts
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Rapport de stock généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   warehouseId:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                     description: Quantité en stock
 *                   reservedQty:
 *                     type: integer
 *                     description: Quantité réservée
 *                   lastUpdated:
 *                     type: string
 *                     format: date-time
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *                   warehouse:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       address:
 *                         type: string
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
    checkOrganization(orgId);

    const stocks = await prisma.warehouseStock.findMany({
      where: { product: { organizationId: orgId } },
      include: { product: true, warehouse: true },
      orderBy: [{ productId: "asc" }, { warehouseId: "asc" }],
    });

    return NextResponse.json(stocks);
  } catch (e: unknown) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
