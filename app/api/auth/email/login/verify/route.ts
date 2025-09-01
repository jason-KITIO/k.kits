import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 jours

/**
 * @swagger
 * /api/auth/email/login/verify:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Vérification du code OTP pour connexion par email
 *     description: Vérifie le code OTP et crée une session utilisateur avec gestion des organisations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 pattern: "^[0-9]{6}$"
 *                 description: Code OTP à 6 chiffres reçu par email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         headers:
 *           Set-Cookie:
 *             description: Cookies de session et organisation
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie via OTP"
 *                 user:
 *                   type: object
 *                   description: Informations de l'utilisateur connecté
 *                 organizations:
 *                   type: array
 *                   description: Liste des organisations de l'utilisateur
 *                   items:
 *                     type: object
 *                 selectedOrganization:
 *                   type: object
 *                   nullable: true
 *                   description: Organisation actuellement sélectionnée
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email et code OTP sont requis"
 *       401:
 *         description: Code OTP invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code OTP invalide ou expiré"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur, veuillez réessayer plus tard"
 */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email et code OTP sont requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organizationMembers: {
          where: { active: true },
          include: { organization: true },
        },
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (
      !user.verificationToken ||
      user.verificationToken !== otp ||
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < new Date()
    ) {
      return NextResponse.json(
        { message: "Code OTP invalide ou expiré" },
        { status: 401 }
      );
    }

    const now = new Date();

    // Réinitialise le code OTP après utilisation
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastSignInAt: now,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Création session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(now.getTime() + SESSION_EXPIRES_IN * 1000);

    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken,
        createdAt: now,
        lastActiveAt: now,
        expiresAt,
        active: true,
      },
    });

    // Lecture cookie selected-org-id s’il existe
    const cookieStore = request.cookies;
    const requestedOrgId = cookieStore.get("selected-org-id")?.value;

    // Liste des organisations actives de l’utilisateur
    const activeOrgs = user.organizationMembers.map((om) => om.organization);

    // Vérifier si le cookie existe et est valide (appartient à l’utilisateur)
    const orgFromCookie = activeOrgs.find((org) => org.id === requestedOrgId);

    // Organisation à utiliser
    const selectedOrg = orgFromCookie || null;

    // Construire cookies de session + organisation (si sélectionnée)
    const cookieSession =
      `session_token=${sessionToken}; HttpOnly; Path=/; Max-Age=${SESSION_EXPIRES_IN}; SameSite=Lax` +
      (process.env.NODE_ENV === "production" ? "; Secure" : "");

    const responsePayload: {
      message: string;
      user: typeof user;
      organizations: typeof activeOrgs;
      selectedOrganization?: typeof selectedOrg;
    } = {
      message: "Connexion réussie via OTP",
      user,
      organizations: activeOrgs,
    };

    const response = NextResponse.json(responsePayload);

    response.headers.append("Set-Cookie", cookieSession);

    if (selectedOrg) {
      // Mettre à jour ou créer cookie selected-org-id avec organisation valide
      const cookieOrg =
        `selected-org-id=${selectedOrg.id}; HttpOnly; Path=/; Max-Age=${SESSION_EXPIRES_IN}; SameSite=Strict` +
        (process.env.NODE_ENV === "production" ? "; Secure" : "");
      response.headers.append("Set-Cookie", cookieOrg);

      // Ajouter info organisation choisie dans réponse
      responsePayload.selectedOrganization = selectedOrg;
    } else {
      // Pas d’organisation valide dans cookie : renvoyer liste pour sélection côté client
      responsePayload.selectedOrganization = null;
    }

    return response;
  } catch {
    console.error("Erreur vérification OTP");
    return NextResponse.json(
      { message: "Erreur serveur, veuillez réessayer plus tard" },
      { status: 500 }
    );
  }
}
