import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/warehouses:
 *   get:
 *     tags:
 *       - Warehouses
 *     summary: Récupération des entrepôts
 *     description: Retourne tous les entrepôts actifs de l'organisation
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
 *         description: Liste des entrepôts
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
 *                   address:
 *                     type: string
 *                   managerId:
 *                     type: string
 *                   active:
 *                     type: boolean
 *       403:
 *         description: Accès refusé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const warehouses = await prisma.warehouse.findMany({
      where: { organizationId: params.organizationId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    return NextResponse.json(
      { message: "Accès refusé : organisation non valide ou non sélectionnée." },
      { status: 403 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/warehouses:
 *   post:
 *     tags:
 *       - Warehouses
 *     summary: Création d'un entrepôt
 *     description: Crée un nouvel entrepôt dans l'organisation
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
 *                 example: "Entrepôt Principal"
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               managerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entrepôt créé avec succès
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json(
        { message: "Le champ 'name' est obligatoire." },
        { status: 400 }
      );
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        address: data.address ?? null,
        managerId: data.managerId ?? null,
        organizationId: params.organizationId,
        active: true,
      },
    });

    return NextResponse.json(warehouse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la création de l’entrepôt." },
      { status: 500 }
    );
  }
}
