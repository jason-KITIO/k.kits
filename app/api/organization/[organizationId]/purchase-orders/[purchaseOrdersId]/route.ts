import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * Récupère une commande avec ses détails
 * @param purchaseOrdersId - ID de la commande
 * @returns Commande avec fournisseur, créateur et items
 */
async function getOrder(purchaseOrdersId: string) {
  return prisma.purchaseOrder.findUnique({
    where: { id: purchaseOrdersId },
    include: {
      supplier: true,
      creator: true,
      items: true,
    },
  });
}

/**
 * @swagger
 * /api/organization/{organizationId}/purchase-orders/{purchaseOrdersId}:
 *   get:
 *     tags:
 *       - Purchase Orders
 *     summary: Récupération d'une commande d'achat
 *     description: Retourne les détails d'une commande d'achat avec ses items
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: purchaseOrdersId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Commande récupérée avec succès
 *       404:
 *         description: Commande non trouvée
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { purchaseOrdersId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await getOrder(params.purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/purchase-orders/{purchaseOrdersId}:
 *   put:
 *     tags:
 *       - Purchase Orders
 *     summary: Mise à jour d'une commande d'achat
 *     description: Met à jour les informations d'une commande d'achat
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: purchaseOrdersId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderNumber:
 *                 type: string
 *               supplierId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SENT, CONFIRMED, RECEIVED, CANCELLED]
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *               expectedDate:
 *                 type: string
 *                 format: date-time
 *               receivedDate:
 *                 type: string
 *                 format: date-time
 *               totalAmount:
 *                 type: number
 *               notes:
 *                 type: string
 *               approvedBy:
 *                 type: string
 *               receivedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { purchaseOrdersId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await getOrder(params.purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    const data = await request.json();

    const updated = await prisma.purchaseOrder.update({
      where: { id: params.purchaseOrdersId },
      data: {
        orderNumber: data.orderNumber ?? order.orderNumber,
        supplierId: data.supplierId ?? order.supplierId,
        status: data.status ?? order.status,
        orderDate: data.orderDate ? new Date(data.orderDate) : order.orderDate,
        expectedDate: data.expectedDate
          ? new Date(data.expectedDate)
          : order.expectedDate,
        receivedDate: data.receivedDate
          ? new Date(data.receivedDate)
          : order.receivedDate,
        totalAmount: data.totalAmount ?? order.totalAmount,
        notes: data.notes ?? order.notes,
        approvedBy: data.approvedBy ?? order.approvedBy,
        receivedBy: data.receivedBy ?? order.receivedBy,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

// Envoyer au fournisseur (mise à jour du statut et date)
export async function PUT_send(
  request: NextRequest,
  { params }: { params: { purchaseOrdersId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const userId = request.cookies.get("user-id")?.value;
    if (!organizationId || !userId)
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await getOrder(params.purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    if (order.status !== "DRAFT" && order.status !== "CONFIRMED") {
      return NextResponse.json(
        { message: "Commande ne peut plus être envoyée." },
        { status: 400 }
      );
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id: params.purchaseOrdersId },
      data: {
        status: "SENT",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

// Réceptionner la commande
export async function PUT_receive(
  request: NextRequest,
  { params }: { params: { purchaseOrdersId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const userId = request.cookies.get("user-id")?.value;
    if (!organizationId || !userId)
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await getOrder(params.purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    if (order.status !== "SENT") {
      return NextResponse.json(
        { message: "Commande ne peut être réceptionnée." },
        { status: 400 }
      );
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id: params.purchaseOrdersId },
      data: {
        status: "RECEIVED",
        receivedDate: new Date(),
        updatedAt: new Date(),
        receivedBy: userId,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/purchase-orders/{purchaseOrdersId}:
 *   delete:
 *     tags:
 *       - Purchase Orders
 *     summary: Suppression d'une commande d'achat
 *     description: Supprime définitivement une commande d'achat
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: purchaseOrdersId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { purchaseOrdersId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(request, organizationId);

    const order = await getOrder(params.purchaseOrdersId);
    if (!order || order.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Commande non trouvée ou accès refusé." },
        { status: 404 }
      );

    await prisma.purchaseOrder.delete({ where: { id: params.purchaseOrdersId } });

    return NextResponse.json({ message: "Commande supprimée avec succès." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
