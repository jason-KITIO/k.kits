import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/purchase-orders:
 *   get:
 *     tags:
 *       - Purchase Orders
 *     summary: Récupération des commandes d'achat
 *     description: Retourne toutes les commandes d'achat de l'organisation triées par date
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes d'achat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   orderNumber:
 *                     type: string
 *                   supplierId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [DRAFT, SENT, CONFIRMED, RECEIVED, CANCELLED]
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 *                   expectedDate:
 *                     type: string
 *                     format: date-time
 *                   receivedDate:
 *                     type: string
 *                     format: date-time
 *                   totalAmount:
 *                     type: number
 *                   notes:
 *                     type: string
 *                   supplier:
 *                     type: object
 *                   creator:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Organisation non sélectionnée
 *       500:
 *         description: Erreur serveur
 */
export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const orders = await prisma.purchaseOrder.findMany({
      where: { organizationId },
      include: {
        supplier: true,
        creator: true,
        // approvedByUser: true,
        // receivedByUser: true,
      },
      orderBy: { orderDate: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/purchase-orders:
 *   post:
 *     tags:
 *       - Purchase Orders
 *     summary: Création d'une commande d'achat
 *     description: Crée une nouvelle commande d'achat
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *             properties:
 *               supplierId:
 *                 type: string
 *                 description: ID du fournisseur
 *               orderNumber:
 *                 type: string
 *                 description: Numéro de commande (généré automatiquement si non fourni)
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SENT, CONFIRMED, RECEIVED, CANCELLED]
 *                 default: DRAFT
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *               expectedDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Données manquantes
 *       403:
 *         description: Non authentifié
 *       404:
 *         description: Fournisseur non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const createdBy = request.cookies.get("user-id")?.value;
    if (!organizationId || !createdBy)
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const data = await request.json();

    // Validation des champs obligatoires
    if (!data.supplierId)
      return NextResponse.json(
        { message: "supplierId est obligatoire." },
        { status: 400 }
      );

    // Vérifier fournisseur appartient à organisation
    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });
    if (!supplier || supplier.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Fournisseur non trouvé dans cette organisation." },
        { status: 404 }
      );

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: data.orderNumber ?? `PO-${Date.now()}`,
        supplierId: data.supplierId,
        organizationId,
        status: data.status ?? "DRAFT",
        orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
        notes: data.notes ?? null,
        createdBy,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
