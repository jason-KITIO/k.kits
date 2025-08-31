import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/suppliers:
 *   get:
 *     tags:
 *       - Suppliers
 *     summary: Récupération des fournisseurs
 *     description: Retourne tous les fournisseurs actifs de l'organisation
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
 *         description: Liste des fournisseurs
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
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   contactPerson:
 *                     type: string
 *                   taxNumber:
 *                     type: string
 *                   paymentTerms:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   active:
 *                     type: boolean
 *       403:
 *         description: Accès refusé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{$1}> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    const suppliers = await prisma.supplier.findMany({
      where: { organizationId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(suppliers);
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
 * /api/organization/{organizationId}/suppliers:
 *   post:
 *     tags:
 *       - Suppliers
 *     summary: Création d'un fournisseur
 *     description: Crée un nouveau fournisseur dans l'organisation
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
 *                 example: "Fournisseur ABC"
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               taxNumber:
 *                 type: string
 *               paymentTerms:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fournisseur créé avec succès
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{$1}> }
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

    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        contactPerson: data.contactPerson ?? null,
        taxNumber: data.taxNumber ?? null,
        paymentTerms: data.paymentTerms ?? null,
        notes: data.notes ?? null,
        organizationId,
        active: true,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la création du fournisseur." },
      { status: 500 }
    );
  }
}
