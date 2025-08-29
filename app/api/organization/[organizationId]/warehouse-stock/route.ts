import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/warehouse-stock:
 *   get:
 *     tags:
 *       - Warehouse Stock
 *     summary: Récupération du stock des entrepôts
 *     description: Retourne le stock de tous les produits dans tous les entrepôts de l'organisation
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Stock des entrepôts récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID du stock
 *                   productId:
 *                     type: string
 *                     description: ID du produit
 *                   warehouseId:
 *                     type: string
 *                     description: ID de l'entrepôt
 *                   locationId:
 *                     type: string
 *                     description: ID de l'emplacement
 *                   quantity:
 *                     type: integer
 *                     description: Quantité en stock
 *                     example: 150
 *                   reservedQty:
 *                     type: integer
 *                     description: Quantité réservée
 *                     example: 10
 *                   product:
 *                     type: object
 *                     description: Détails du produit
 *                   warehouse:
 *                     type: object
 *                     description: Détails de l'entrepôt
 *                   location:
 *                     type: object
 *                     description: Détails de l'emplacement
 *                   lastUpdated:
 *                     type: string
 *                     format: date-time
 *                     description: Dernière mise à jour
 *       403:
 *         description: Organisation non sélectionnée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organisation non sélectionnée."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur."
 */
export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const stock = await prisma.warehouseStock.findMany({
      where: { warehouse: { organizationId } },
      include: { product: true, warehouse: true, location: true },
      orderBy: [{ warehouseId: "asc" }, { productId: "asc" }],
    });

    return NextResponse.json(stock);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
