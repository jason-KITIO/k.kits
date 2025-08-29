import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Construit un arbre hiérarchique de catégories
 * @param categories - Liste des catégories
 * @param parentId - ID du parent (null pour les racines)
 * @returns Arbre hiérarchique des catégories
 */
function buildTree(
  categories: Category[],
  parentId: string | null = null
): CategoryWithChildren[] {
  return categories
    .filter((cat) => cat.parentId === parentId)
    .map((cat) => ({
      ...cat,
      children: buildTree(categories, cat.id),
    }));
}

// Interface étendue pour inclure children
interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

/**
 * @swagger
 * /api/organization/{organizationId}/categories/tree:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Arbre hiérarchique des catégories
 *     description: Retourne les catégories organisées en arbre hiérarchique
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
 *         description: Arbre des catégories récupéré avec succès
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
 *                       $ref: '#/components/schemas/Category'
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
  { params }: { params: { organizationId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const categories = await prisma.category.findMany({
      where: { organizationId: params.organizationId, active: true },
      orderBy: { name: "asc" },
    });

    const tree = buildTree(categories);
    return NextResponse.json(tree);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Accès refusé ou erreur serveur durant la récupération de la hiérarchie.",
      },
      { status: 403 }
    );
  }
}
