import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Récupération d'un produit
 *     description: Retourne les détails d'un produit spécifique
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Produit récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *       403:
 *         description: Accès refusé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; productId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!product || product.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Accès refusé ou erreur serveur lors de la récupération du produit.",
      },
      { status: 403 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/products/{productId}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Mise à jour d'un produit
 *     description: Met à jour les informations d'un produit
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
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
 *               sku:
 *                 type: string
 *               barcode:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               supplierId:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               minStock:
 *                 type: integer
 *               maxStock:
 *                 type: integer
 *               unit:
 *                 type: string
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { organizationId: string; productId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const existing = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!existing || existing.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const data = await request.json();

    const updated = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        sku: data.sku ?? existing.sku,
        barcode: data.barcode ?? existing.barcode,
        categoryId: data.categoryId ?? existing.categoryId,
        supplierId: data.supplierId ?? existing.supplierId,
        unitPrice: data.unitPrice ?? existing.unitPrice,
        costPrice: data.costPrice ?? existing.costPrice,
        minStock: data.minStock ?? existing.minStock,
        maxStock: data.maxStock ?? existing.maxStock,
        unit: data.unit ?? existing.unit,
        weight: data.weight ?? existing.weight,
        dimensions: data.dimensions ?? existing.dimensions,
        imageUrl: data.imageUrl ?? existing.imageUrl,
        active: data.active ?? existing.active,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour du produit." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/organization/{organizationId}/products/{productId}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Suppression d'un produit
 *     description: Supprime définitivement un produit
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { organizationId: string; productId: string } }
) {
  try {
    checkOrganization(request, params.organizationId);

    const existing = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!existing || existing.organizationId !== params.organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id: params.productId } });

    return NextResponse.json({ message: "Produit supprimé avec succès." });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression du produit." },
      { status: 500 }
    );
  }
}
