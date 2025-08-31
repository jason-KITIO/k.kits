import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/categories/{categoryId}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Récupération d'une catégorie
 *     description: Retourne les détails d'une catégorie avec ses sous-catégories et produits
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Catégorie récupérée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       403:
 *         description: Accès refusé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; categoryId: string }> }
) {
  try {
    const { organizationId, categoryId } = await params;
    checkOrganization(organizationId);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { children: true, products: true },
    });

    if (!category || category.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Catégorie non trouvée dans cette organisation." },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      {
        message:
          "Accès refusé ou erreur serveur lors de la récupération de la catégorie.",
      },
      { status: 403 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/categories/{categoryId}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Mise à jour d'une catégorie
 *     description: Met à jour les informations d'une catégorie existante
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
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
 *               color:
 *                 type: string
 *               icon:
 *                 type: string
 *               parentId:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; categoryId: string }> }
) {
  try {
    const { organizationId, categoryId } = await params;
    checkOrganization(organizationId);

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existing || existing.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Catégorie non trouvée dans cette organisation." },
        { status: 404 }
      );
    }

    const data = await request.json();

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        color: data.color ?? existing.color,
        icon: data.icon ?? existing.icon,
        parentId: data.parentId ?? existing.parentId,
        active: data.active ?? existing.active,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour de la catégorie." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/categories/{categoryId}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Suppression d'une catégorie
 *     description: Supprime définitivement une catégorie
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; categoryId: string }> }
) {
  try {
    const { organizationId, categoryId } = await params;
    checkOrganization(organizationId);

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existing || existing.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Catégorie non trouvée dans cette organisation." },
        { status: 404 }
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return NextResponse.json({ message: "Catégorie supprimée avec succès." });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression de la catégorie." },
      { status: 500 }
    );
  }
}
