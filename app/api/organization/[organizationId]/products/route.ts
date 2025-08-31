import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { generateSku, generateUniqueSku } from "@/helper/generate-sku";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization/{organizationId}/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Récupération des produits d'une organisation
 *     description: Retourne la liste de tous les produits actifs d'une organisation
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
 *         description: Liste des produits récupérée avec succès
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
 *                   sku:
 *                     type: string
 *                   barcode:
 *                     type: string
 *                   unitPrice:
 *                     type: number
 *                   costPrice:
 *                     type: number
 *                   minStock:
 *                     type: integer
 *                   maxStock:
 *                     type: integer
 *                   unit:
 *                     type: string
 *                   active:
 *                     type: boolean
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accès refusé : organisation non valide ou non sélectionnée."
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    const products = await prisma.product.findMany({
      where: { organizationId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
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
 * /api/organization/{organizationId}/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Création d'un nouveau produit
 *     description: Crée un nouveau produit dans l'organisation spécifiée
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
 *                 description: Nom du produit
 *                 example: "Ordinateur portable"
 *               sku:
 *                 type: string
 *                 description: Code SKU (généré automatiquement si non fourni)
 *                 example: "ordinateur-portable"
 *               description:
 *                 type: string
 *                 description: Description du produit
 *               barcode:
 *                 type: string
 *                 description: Code-barres
 *               categoryId:
 *                 type: string
 *                 description: ID de la catégorie
 *               supplierId:
 *                 type: string
 *                 description: ID du fournisseur
 *               unitPrice:
 *                 type: number
 *                 description: Prix unitaire
 *                 example: 999.99
 *               costPrice:
 *                 type: number
 *                 description: Prix de revient
 *               minStock:
 *                 type: integer
 *                 description: Stock minimum
 *                 example: 5
 *               maxStock:
 *                 type: integer
 *                 description: Stock maximum
 *               unit:
 *                 type: string
 *                 description: Unité de mesure
 *                 example: "pcs"
 *               weight:
 *                 type: number
 *                 description: Poids
 *               dimensions:
 *                 type: string
 *                 description: Dimensions
 *               imageUrl:
 *                 type: string
 *                 description: URL de l'image
 *               color:
 *                 type: string
 *                 description: Couleur du produit
 *               material:
 *                 type: string
 *                 description: Matière du produit
 *               size:
 *                 type: string
 *                 description: Taille du produit
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Détails du produit créé
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Le champ 'name' est obligatoire."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur lors de la création du produit."
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

    // Générer le SKU automatiquement si non fourni
    let sku = data.sku;
    if (!sku) {
      const baseSku = generateSku(data.name);
      const existingProducts = await prisma.product.findMany({
        where: { organizationId },
        select: { sku: true },
      });
      const existingSkus = existingProducts.map((p) => p.sku);
      sku = generateUniqueSku(baseSku, existingSkus);
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        sku: sku,
        barcode: data.barcode ?? null,
        categoryId: data.categoryId ?? null,
        supplierId: data.supplierId ?? null,
        organizationId,
        unitPrice: data.unitPrice ?? null,
        costPrice: data.costPrice ?? null,
        minStock: data.minStock ?? 0,
        maxStock: data.maxStock ?? null,
        unit: data.unit ?? "pcs",
        weight: data.weight ?? null,
        dimensions: data.dimensions ?? null,
        imageUrl: data.imageUrl ?? null,
        active: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la création du produit." },
      { status: 500 }
    );
  }
}
