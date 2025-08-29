import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/stock-movements:
 *   get:
 *     tags:
 *       - Stock Movements
 *     summary: Récupération des mouvements de stock
 *     description: Retourne l'historique paginé des mouvements de stock de l'organisation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Nombre d'éléments à ignorer pour la pagination
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Nombre d'éléments à retourner
 *     responses:
 *       200:
 *         description: Mouvements de stock récupérés avec succès
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
 *                   userId:
 *                     type: string
 *                   movementType:
 *                     type: string
 *                     enum: [IN, OUT, TRANSFER, ADJUSTMENT, INVENTORY]
 *                   quantity:
 *                     type: integer
 *                   remainingQty:
 *                     type: integer
 *                   reference:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *                   warehouse:
 *                     type: object
 *                   employee:
 *                     $ref: '#/components/schemas/User'
 *                   performedByUser:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Organisation non sélectionnée
 *       500:
 *         description: Erreur serveur
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

    const { searchParams } = new URL(request.url);
    const skip = Number(searchParams.get("skip") ?? "0");
    const take = Number(searchParams.get("take") ?? "50");

    // Récupération paginée, triée par date décroissante
    const movements = await prisma.stockMovement.findMany({
      where: {
        product: {
          organizationId,
        },
      },
      include: {
        product: true,
        warehouse: true,
        employee: true,
        performedByUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    return NextResponse.json(movements);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/stock-movements:
 *   post:
 *     tags:
 *       - Stock Movements
 *     summary: Création d'un mouvement de stock
 *     description: Enregistre un nouveau mouvement de stock (entrée, sortie, transfert, ajustement, inventaire)
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
 *               - movementType
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit
 *               warehouseId:
 *                 type: string
 *                 description: ID de l'entrepôt (optionnel)
 *               userId:
 *                 type: string
 *                 description: ID de l'employé (optionnel)
 *               movementType:
 *                 type: string
 *                 enum: [IN, OUT, TRANSFER, ADJUSTMENT, INVENTORY]
 *                 description: Type de mouvement
 *               quantity:
 *                 type: integer
 *                 description: Quantité du mouvement
 *                 example: 10
 *               remainingQty:
 *                 type: integer
 *                 description: Quantité restante après le mouvement
 *               reference:
 *                 type: string
 *                 description: Référence du mouvement
 *               reason:
 *                 type: string
 *                 description: Raison du mouvement
 *               notes:
 *                 type: string
 *                 description: Notes additionnelles
 *     responses:
 *       201:
 *         description: Mouvement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Détails du mouvement créé
 *       400:
 *         description: Données manquantes ou invalides
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit ou entrepôt non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const performedByUserId = request.cookies.get("user-id")?.value;
    if (!organizationId || !performedByUserId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non identifié." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const data = await request.json();

    if (
      !data.productId ||
      !data.movementType ||
      typeof data.quantity !== "number"
    ) {
      return NextResponse.json(
        { message: "productId, movementType et quantity sont obligatoires." },
        { status: 400 }
      );
    }

    // Vérification produit & organisation
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    // Vérification entrepôt si fourni
    if (data.warehouseId) {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: data.warehouseId },
      });
      if (!warehouse || warehouse.organizationId !== organizationId) {
        return NextResponse.json(
          { message: "Entrepôt non trouvé dans cette organisation." },
          { status: 404 }
        );
      }
    }

    // Vérification utilisateur si fourni comme employee
    if (data.userId) {
      const member = await prisma.organizationMember.findFirst({
        where: { userId: data.userId, organizationId, active: true },
      });
      if (!member) {
        return NextResponse.json(
          { message: "Employé non membre de l'organisation." },
          { status: 403 }
        );
      }
    }

    const movement = await prisma.stockMovement.create({
      data: {
        productId: data.productId,
        warehouseId: data.warehouseId ?? null,
        userId: data.userId ?? null,
        movementType: data.movementType,
        quantity: data.quantity,
        remainingQty: data.remainingQty ?? null,
        reference: data.reference ?? null,
        reason: data.reason ?? null,
        notes: data.notes ?? null,
        performedBy: performedByUserId,
      },
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
