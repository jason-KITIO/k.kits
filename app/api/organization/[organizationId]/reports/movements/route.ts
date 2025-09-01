import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/reports/movements:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Rapport des mouvements de stock
 *     description: Génère un rapport complet de tous les mouvements de stock
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Rapport des mouvements généré avec succès
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
 *                   performedBy:
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

    const movements = await prisma.stockMovement.findMany({
      where: { product: { organizationId: orgId } },
      include: { product: true, warehouse: true, employee: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movements);
  } catch (e: unknown) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
