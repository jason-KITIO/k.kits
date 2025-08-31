import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/stock-alerts/unread:
 *   get:
 *     tags:
 *       - Stock Alerts
 *     summary: Alertes de stock non lues
 *     description: Retourne uniquement les alertes de stock non lues et actives
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des alertes non lues
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
 *                     example: false
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
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
export async function GET(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const alerts = await prisma.stockAlert.findMany({
      where: {
        product: { organizationId },
        isRead: false,
        isActive: true,
      },
      include: { product: true, creator: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(alerts);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
