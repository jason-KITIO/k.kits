import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";
import { handleApiError } from "@/lib/error-handler";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/stock-alerts:
 *   get:
 *     tags:
 *       - Stock Alerts
 *     summary: Récupération des alertes de stock
 *     description: Retourne toutes les alertes de stock de l'organisation
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des alertes de stock
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
 *                   alertType:
 *                     type: string
 *                     enum: [LOW_STOCK, OUT_OF_STOCK, OVERSTOCK]
 *                   threshold:
 *                     type: integer
 *                   currentQty:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   isRead:
 *                     type: boolean
 *                   isActive:
 *                     type: boolean
 *                   createdBy:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   readAt:
 *                     type: string
 *                     format: date-time
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *                   creator:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Organisation non sélectionnée
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;

    const organizationCheck = await checkOrganization(organizationId);
    if (!organizationCheck.success) {
      return NextResponse.json(
        { message: organizationCheck.message },
        { status: organizationCheck.status }
      );
    }

    const alerts = await prisma.stockAlert.findMany({
      where: { product: { organizationId } },
      include: { product: true, creator: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(alerts);
  } catch (error: unknown) {
    return handleApiError(error, "stock-alerts GET");
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/stock-alerts:
 *   post:
 *     tags:
 *       - Stock Alerts
 *     summary: Création d'une alerte de stock
 *     description: Crée une nouvelle alerte de stock pour un produit
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
 *               - alertType
 *               - threshold
 *               - currentQty
 *               - message
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit
 *               alertType:
 *                 type: string
 *                 enum: [LOW_STOCK, OUT_OF_STOCK, OVERSTOCK]
 *                 description: Type d'alerte
 *               threshold:
 *                 type: integer
 *                 description: Seuil déclencheur
 *                 example: 10
 *               currentQty:
 *                 type: integer
 *                 description: Quantité actuelle
 *                 example: 5
 *               message:
 *                 type: string
 *                 description: Message d'alerte
 *                 example: "Stock faible pour ce produit"
 *     responses:
 *       201:
 *         description: Alerte créée avec succès
 *       400:
 *         description: Données manquantes
 *       403:
 *         description: Non authentifié
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    const creatorId = request.cookies.get("user-id")?.value;

    const organizationCheck = await checkOrganization(organizationId);
    if (!organizationCheck.success) {
      return NextResponse.json(
        { message: organizationCheck.message },
        { status: organizationCheck.status }
      );
    }

    if (!creatorId) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié." },
        { status: 401 }
      );
    }

    const data = await request.json();
    if (
      !data.productId ||
      !data.alertType ||
      data.threshold === undefined ||
      data.currentQty === undefined ||
      !data.message
    ) {
      return NextResponse.json(
        { message: "Données obligatoires manquantes." },
        { status: 400 }
      );
    }

    // Vérifier que le produit appartient à l'organisation
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );

    const alert = await prisma.stockAlert.create({
      data: {
        productId: data.productId,
        alertType: data.alertType,
        threshold: data.threshold,
        currentQty: data.currentQty,
        message: data.message,
        isRead: false,
        isActive: true,
        createdBy: creatorId,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error, "stock-alerts POST");
  }
}
