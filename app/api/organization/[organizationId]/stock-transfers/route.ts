import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/stock-transfers:
 *   get:
 *     tags:
 *       - Stock Transfers
 *     summary: Récupération des transferts de stock
 *     description: Retourne tous les transferts de stock de l'organisation triés par date de demande
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des transferts de stock
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
 *                   quantity:
 *                     type: integer
 *                   sourceWarehouseId:
 *                     type: string
 *                   sourceUserId:
 *                     type: string
 *                   destWarehouseId:
 *                     type: string
 *                   destUserId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [PENDING, APPROVED, COMPLETED, CANCELLED]
 *                   notes:
 *                     type: string
 *                   requestedBy:
 *                     type: string
 *                   requestedAt:
 *                     type: string
 *                     format: date-time
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *                   sourceWarehouse:
 *                     type: object
 *                   destWarehouse:
 *                     type: object
 *                   sourceUser:
 *                     $ref: '#/components/schemas/User'
 *                   destUser:
 *                     $ref: '#/components/schemas/User'
 *                   requester:
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
        { message: "Organisation non sélectionnée" },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const transfers = await prisma.stockTransfer.findMany({
      where: {
        product: {
          organizationId,
        },
      },
      include: {
        product: true,
        sourceWarehouse: true,
        destWarehouse: true,
        sourceUser: true,
        destUser: true,
        requester: true,
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return NextResponse.json(transfers);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/stock-transfers:
 *   post:
 *     tags:
 *       - Stock Transfers
 *     summary: Création d'une demande de transfert
 *     description: Crée une nouvelle demande de transfert de stock entre entrepôts ou employés
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
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit à transférer
 *               quantity:
 *                 type: integer
 *                 description: Quantité à transférer
 *                 example: 10
 *               sourceWarehouseId:
 *                 type: string
 *                 description: ID de l'entrepôt source
 *               sourceUserId:
 *                 type: string
 *                 description: ID de l'employé source
 *               destWarehouseId:
 *                 type: string
 *                 description: ID de l'entrepôt destination
 *               destUserId:
 *                 type: string
 *                 description: ID de l'employé destination
 *               notes:
 *                 type: string
 *                 description: Notes sur le transfert
 *     responses:
 *       201:
 *         description: Demande de transfert créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Détails du transfert créé
 *       400:
 *         description: Données manquantes
 *       403:
 *         description: Non authentifié
 *       404:
 *         description: Produit ou entrepôt non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const requesterId = request.cookies.get("user-id")?.value;
    if (!organizationId || !requesterId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié" },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const data = await request.json();

    // Validation champ obligatoire
    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { message: "productId et quantity obligatoires" },
        { status: 400 }
      );
    }

    // Vérifier que produit appartient à l'organisation
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation" },
        { status: 404 }
      );
    }

    // Vérifier entrepôts source et destination (si fournis)
    if (data.sourceWarehouseId) {
      const sourceWarehouse = await prisma.warehouse.findUnique({
        where: { id: data.sourceWarehouseId },
      });
      if (
        !sourceWarehouse ||
        sourceWarehouse.organizationId !== organizationId
      ) {
        return NextResponse.json(
          { message: "Entrepôt source non trouvé dans cette organisation" },
          { status: 404 }
        );
      }
    }
    if (data.destWarehouseId) {
      const destWarehouse = await prisma.warehouse.findUnique({
        where: { id: data.destWarehouseId },
      });
      if (!destWarehouse || destWarehouse.organizationId !== organizationId) {
        return NextResponse.json(
          {
            message: "Entrepôt destination non trouvé dans cette organisation",
          },
          { status: 404 }
        );
      }
    }

    // Creer demande de transfert en statut PENDING
    const transfer = await prisma.stockTransfer.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        sourceWarehouseId: data.sourceWarehouseId ?? null,
        sourceUserId: data.sourceUserId ?? null,
        destWarehouseId: data.destWarehouseId ?? null,
        destUserId: data.destUserId ?? null,
        notes: data.notes ?? null,
        requestedBy: requesterId,
        status: "PENDING",
        requestedAt: new Date(),
      },
      include: {
        product: true,
        sourceWarehouse: true,
        destWarehouse: true,
        sourceUser: true,
        destUser: true,
        requester: true,
      },
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
