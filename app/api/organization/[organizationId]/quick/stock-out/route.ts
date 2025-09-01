import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/quick/stock-out:
 *   post:
 *     tags:
 *       - Quick Actions
 *     summary: Sortie rapide de stock
 *     description: Retire rapidement du stock d'un produit dans un entrepôt et enregistre le mouvement
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - warehouseId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit
 *               quantity:
 *                 type: integer
 *                 description: Quantité à retirer
 *                 example: 20
 *               warehouseId:
 *                 type: string
 *                 description: ID de l'entrepôt
 *     responses:
 *       200:
 *         description: Stock mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 warehouseId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                   description: Nouvelle quantité restante
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Données manquantes ou stock insuffisant
 *       403:
 *         description: Non authentifié
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    const orgId = request.cookies.get("selected-org-id")?.value;
    const userId = request.cookies.get("user-id")?.value;
    if (!orgId || !userId)
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    checkOrganization(orgId);

    const data = await request.json();

    if (!data.productId || !data.quantity || !data.warehouseId) {
      return NextResponse.json(
        { message: "productId, quantity et warehouseId sont obligatoires." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== orgId) {
      return NextResponse.json(
        { message: "Produit introuvable dans l'organisation." },
        { status: 404 }
      );
    }

    const warehouseStock = await prisma.warehouseStock.findFirst({
      where: { productId: data.productId, warehouseId: data.warehouseId },
    });

    if (!warehouseStock || warehouseStock.quantity < Number(data.quantity)) {
      return NextResponse.json(
        { message: "Stock insuffisant pour sortie." },
        { status: 400 }
      );
    }

    const updatedStock = await prisma.warehouseStock.update({
      where: { id: warehouseStock.id },
      data: {
        quantity: warehouseStock.quantity - Number(data.quantity),
        updatedAt: new Date(),
      },
    });

    await prisma.stockMovement.create({
      data: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        movementType: "OUT",
        quantity: Number(data.quantity),
        performedBy: userId,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(updatedStock);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
