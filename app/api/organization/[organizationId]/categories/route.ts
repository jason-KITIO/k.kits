import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Récupération des catégories
 *     description: Retourne toutes les catégories actives de l'organisation avec leurs sous-catégories
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   color:
 *                     type: string
 *                   icon:
 *                     type: string
 *                   parentId:
 *                     type: string
 *                   children:
 *                     type: array
 *                     items:
 *                       type: object
 *                   active:
 *                     type: boolean
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    const categories = await prisma.category.findMany({
      where: { organizationId, active: true },
      include: { children: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      {
        message: "Accès refusé : organisation non valide ou non sélectionnée.",
      },
      { status: 403 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Création d'une catégorie
 *     description: Crée une nouvelle catégorie dans l'organisation
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la catégorie
 *                 example: "Électronique"
 *               description:
 *                 type: string
 *                 description: Description de la catégorie
 *               color:
 *                 type: string
 *                 description: Couleur de la catégorie
 *                 example: "#FF5733"
 *               icon:
 *                 type: string
 *                 description: Icône de la catégorie
 *               parentId:
 *                 type: string
 *                 description: ID de la catégorie parent
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json(
        { message: "Le champ 'name' est obligatoire." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        parentId: data.parentId ?? null,
        organizationId,
        active: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la création de la catégorie." },
      { status: 500 }
    );
  }
}
