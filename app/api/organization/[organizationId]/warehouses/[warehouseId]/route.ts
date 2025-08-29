import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/warehouses/{warehouseId}:
 *   get:
 *     tags:
 *       - Warehouses
 *     summary: Récupération d'un entrepôt
 *     description: Retourne les détails d'un entrepôt spécifique
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Entrepôt récupéré avec succès
 *       404:
 *         description: Entrepôt non trouvé
 *       403:
 *         description: Accès refusé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; warehouseId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.warehouseId },
    });

    if (!warehouse || warehouse.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json(
      { message: "Accès refusé ou erreur serveur lors de la récupération de l’entrepôt." },
      { status: 403 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/warehouses/{warehouseId}:
 *   put:
 *     tags:
 *       - Warehouses
 *     summary: Mise à jour d'un entrepôt
 *     description: Met à jour les informations d'un entrepôt
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: warehouseId
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               managerId:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Entrepôt mis à jour avec succès
 *       404:
 *         description: Entrepôt non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { organizationId: string; warehouseId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const existing = await prisma.warehouse.findUnique({ where: { id: params.warehouseId } });
    if (!existing || existing.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const data = await request.json();

    const updated = await prisma.warehouse.update({
      where: { id: params.warehouseId },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        address: data.address ?? existing.address,
        managerId: data.managerId ?? existing.managerId,
        active: data.active ?? existing.active,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour de l’entrepôt." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/warehouses/{warehouseId}:
 *   delete:
 *     tags:
 *       - Warehouses
 *     summary: Suppression d'un entrepôt
 *     description: Supprime définitivement un entrepôt
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Entrepôt supprimé avec succès
 *       404:
 *         description: Entrepôt non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { organizationId: string; warehouseId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const existing = await prisma.warehouse.findUnique({ where: { id: params.warehouseId } });
    if (!existing || existing.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    await prisma.warehouse.delete({ where: { id: params.warehouseId } });

    return NextResponse.json({ message: "Entrepôt supprimé avec succès." });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression de l’entrepôt." },
      { status: 500 }
    );
  }
}
