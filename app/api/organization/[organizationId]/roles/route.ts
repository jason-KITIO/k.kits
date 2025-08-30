import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  organizationId: string; // organizationId
}

/**
 * @swagger
 * /api/organization/{organizationId}/roles:
 *   get:
 *     tags:
 *       - Organization Roles
 *     summary: Récupération des rôles d'organisation
 *     description: Retourne tous les rôles associés à une organisation
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: "Manager"
 *                       description:
 *                         type: string
 *                       color:
 *                         type: string
 *                         example: "#FF5733"
 *                       active:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: organizationId manquant
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: NextRequest,
  context: { params: Params | Promise<Params> }
) {
  try {
    const params = await context.params; // await ici
    const organizationId = params.organizationId;

    if (!organizationId) {
      return NextResponse.json(
        { message: "organizationId est requis" },
        { status: 400 }
      );
    }

    // Récupérer les rôles liés à cette organisation via OrganizationRole, inclure le rôle
    const orgRoles = await prisma.organizationRole.findMany({
      where: { organizationId },
      include: {
        role: true, // inclure toutes les données du rôle
      },
    });

    // Extraire uniquement les rôles
    const roles = orgRoles.map((orgRole) => orgRole.role);

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Erreur récupération rôles :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/roles:
 *   post:
 *     tags:
 *       - Organization Roles
 *     summary: Création d'un rôle d'organisation
 *     description: Crée un nouveau rôle et l'associe à l'organisation
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
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
 *                 description: Nom du rôle
 *                 example: "Manager"
 *               description:
 *                 type: string
 *                 description: Description du rôle
 *               color:
 *                 type: string
 *                 description: Couleur du rôle
 *                 example: "#FF5733"
 *     responses:
 *       200:
 *         description: Rôle créé et associé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rôle créé et associé à l'organisation"
 *                 role:
 *                   type: object
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: NextRequest,
  context: { params: Params | Promise<Params> }
) {
  try {
    const params = await context.params;
    const organizationId = params.organizationId;
    const { name, description, color } = await request.json();

    if (!organizationId || !name) {
      return NextResponse.json(
        { message: "organizationId et name requis" },
        { status: 400 }
      );
    }

    // Créer un rôle global
    const role = await prisma.role.create({
      data: { name, description, color },
    });

    // Associer ce rôle à l'organisation
    await prisma.organizationRole.create({
      data: {
        roleId: role.id,
        organizationId,
      },
    });

    return NextResponse.json({
      message: "Rôle créé et associé à l'organisation",
      role,
    });
  } catch (error) {
    console.error("Erreur création rôle :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
