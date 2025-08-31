import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/organization:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Récupération des organisations de l'utilisateur
 *     description: Retourne la liste des organisations créées par l'utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des organisations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "clx1234567890"
 *                       name:
 *                         type: string
 *                         example: "Mon Entreprise"
 *                       description:
 *                         type: string
 *                         example: "Description de l'entreprise"
 *                       domain:
 *                         type: string
 *                         example: "monentreprise.com"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Non authentifié ou session invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Non authentifié"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }
    const sessionToken = match[1];

    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: "Session invalide ou expirée" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    const organizations = await prisma.organization.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        domain: true,
        logo: true,
        address: true,
        phone: true,
        email: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        // Si vous souhaitez inclure des relations, ajoutez-les ici
        members: {
          select: {
            id: true,
            active: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        warehouses: true,
        suppliers: true,
        categories: true,
        products: true,
        purchaseOrders: true,
      },
    });

    return NextResponse.json({ organizations });
  } catch {
    console.error("Erreur récupération organisations :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/organization:
 *   post:
 *     tags:
 *       - Organizations
 *     summary: Création d'une nouvelle organisation
 *     description: Crée une organisation avec l'utilisateur comme créateur et lui attribue le rôle d'auteur avec toutes les permissions
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
 *                 description: Nom de l'organisation
 *                 example: "Mon Entreprise"
 *               description:
 *                 type: string
 *                 description: Description de l'organisation
 *                 example: "Une entreprise innovante"
 *               domain:
 *                 type: string
 *                 description: Domaine web de l'organisation
 *                 example: "monentreprise.com"
 *               logo:
 *                 type: string
 *                 description: URL du logo
 *                 example: "https://example.com/logo.png"
 *               address:
 *                 type: string
 *                 description: Adresse physique
 *                 example: "123 Rue de la Paix, Paris"
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone
 *                 example: "+33123456789"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contact
 *                 example: "contact@monentreprise.com"
 *               active:
 *                 type: boolean
 *                 description: Statut actif de l'organisation
 *                 example: true
 *     responses:
 *       200:
 *         description: Organisation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organisation créée avec succès, rôle auteur attribué avec toutes permissions"
 *                 organization:
 *                   type: object
 *                   description: Détails de l'organisation créée
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Le nom de l'organisation est requis"
 *       401:
 *         description: Non authentifié ou session invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Non authentifié"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur lors de la création d'organisation"
 */
export async function POST(request: NextRequest) {
  try {
    // Extraire userId depuis le cookie session_token
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }
    const sessionToken = match[1];

    // Rechercher la session valide pour récupérer userId
    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: "Session invalide ou expirée" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // Récupérer les données envoyées dans le body
    const { name, description, domain, logo, address, phone, email, active } =
      await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Le nom de l'organisation est requis" },
        { status: 400 }
      );
    }

    // Créer organization
    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        domain,
        logo,
        address,
        phone,
        email,
        active: active !== undefined ? active : true,
        createdBy: userId,
      },
    });

    // Ajouter automatiquement l'utilisateur en tant que membre actif de l'organisation
    await prisma.organizationMember.create({
      data: {
        userId,
        organizationId: organization.id,
        active: true,
        joinedAt: new Date(),
        invitedBy: userId, // optionnel, car c'est lui-même qui a créé l'orga
      },
    });

    // Chercher ou créer le rôle "auteur"
    let authorRole = await prisma.role.findUnique({
      where: { name: "auteur" },
    });

    if (!authorRole) {
      authorRole = await prisma.role.create({
        data: {
          name: "auteur",
          description: "Rôle auteur avec toutes permissions",
          active: true,
        },
      });

      // Créer la permission 'all' si nécessaire
      const allPermission = await prisma.permission.upsert({
        where: { name: "all" },
        update: {},
        create: {
          name: "all",
          resource: "*",
          action: "*",
          description: "Toutes les permissions",
          active: true,
        },
      });

      // Assigner la permission 'all' au rôle auteur
      await prisma.rolePermission.create({
        data: {
          roleId: authorRole.id,
          permissionId: allPermission.id,
          active: true,
        },
      });
    }

    // Associer le rôle auteur à l'organisation
    await prisma.organizationRole.create({
      data: {
        organizationId: organization.id,
        roleId: authorRole.id,
      },
    });

    // Assigner l'utilisateur à ce rôle dans l'organisation
    await prisma.userRole.create({
      data: {
        userId,
        roleId: authorRole.id,
        organizationId: organization.id,
        assignedAt: new Date(),
        active: true,
      },
    });

    return NextResponse.json({
      message:
        "Organisation créée avec succès, rôle auteur attribué avec toutes permissions",
      organization,
    });
  } catch {
    console.error("Erreur création organisation:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la création d'organisation" },
      { status: 500 }
    );
  }
}
