import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/suppliers/{supplierId}:
 *   get:
 *     tags:
 *       - Suppliers
 *     summary: Récupération d'un fournisseur
 *     description: Retourne les détails d'un fournisseur spécifique
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Fournisseur récupéré avec succès
 *       404:
 *         description: Fournisseur non trouvé
 *       403:
 *         description: Accès refusé
 */
export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; supplierId: string }> }
) {
  try {
    const { organizationId, supplierId } = await params;
    checkOrganization(organizationId);

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier || supplier.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Fournisseur non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch {
    return NextResponse.json(
      {
        message:
          "Accès refusé ou erreur serveur lors de la récupération du fournisseur.",
      },
      { status: 403 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/suppliers/{supplierId}:
 *   put:
 *     tags:
 *       - Suppliers
 *     summary: Mise à jour d'un fournisseur
 *     description: Met à jour les informations d'un fournisseur
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: supplierId
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
 *               email:
 *                 type: string
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
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Fournisseur mis à jour avec succès
 *       404:
 *         description: Fournisseur non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; supplierId: string }> }
) {
  try {
    const { organizationId, supplierId } = await params;
    checkOrganization(organizationId);

    const existing = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!existing || existing.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Fournisseur non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const data = await request.json();

    const updated = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        name: data.name ?? existing.name,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
        address: data.address ?? existing.address,
        contactPerson: data.contactPerson ?? existing.contactPerson,
        taxNumber: data.taxNumber ?? existing.taxNumber,
        paymentTerms: data.paymentTerms ?? existing.paymentTerms,
        notes: data.notes ?? existing.notes,
        active: data.active ?? existing.active,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour du fournisseur." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/suppliers/{supplierId}:
 *   delete:
 *     tags:
 *       - Suppliers
 *     summary: Suppression d'un fournisseur
 *     description: Supprime définitivement un fournisseur
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Fournisseur supprimé avec succès
 *       404:
 *         description: Fournisseur non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; supplierId: string }> }
) {
  try {
    const { organizationId, supplierId } = await params;
    checkOrganization(organizationId);

    const existing = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!existing || existing.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Fournisseur non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    await prisma.supplier.delete({ where: { id: supplierId } });

    return NextResponse.json({ message: "Fournisseur supprimé avec succès." });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression du fournisseur." },
      { status: 500 }
    );
  }
}
