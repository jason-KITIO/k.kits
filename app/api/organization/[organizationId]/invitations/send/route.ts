import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendInvitationEmail } from "@/lib/email";

import crypto from "crypto";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

/**
 * @swagger
 * /api/organization/{organizationId}/invitations/send:
 *   post:
 *     tags:
 *       - Organization Invitations
 *     summary: Envoi d'invitation à rejoindre l'organisation
 *     description: Envoie une invitation par email pour rejoindre l'organisation avec un rôle spécifique
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
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de la personne à inviter
 *                 example: "nouveau@example.com"
 *               role:
 *                 type: string
 *                 description: ID du rôle à attribuer
 *                 example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Invitation envoyée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invitation envoyée"
 *                 invitation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     organizationId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roleId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     token:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Données manquantes ou rôle/organisation non trouvé
 *       401:
 *         description: Non authentifié ou session invalide
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: NextRequest,
  context: { params: Params | Promise<Params> }
) {
  try {
    const params = await context.params;
    const organizationId = params.id;

    // Extraire le cookie session_token pour identifier l'utilisateur connecté
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }
    const sessionToken = match[1];

    // Récupérer la session utilisateur active
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

    const invitedByUserId = session.userId;

    const { email, role } = await request.json();

    if (!organizationId || !email || !role) {
      return NextResponse.json(
        { message: "Données requises manquantes" },
        { status: 400 }
      );
    }

    // Trouver le nom du rôle à partir de son id
    const roleRecord = await prisma.role.findUnique({
      where: { id: role },
      select: { name: true },
    });
    if (!roleRecord) {
      return NextResponse.json({ message: "Rôle non trouvé" }, { status: 400 });
    }

    // Trouver le nom de l'organisation
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });
    if (!organization) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 400 }
      );
    }

    // Générer token + expiration
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    // Créer invitation (sans stocker message)
    const invitation = await prisma.invitation.create({
      data: {
        organizationId,
        email,
        roleId: role,
        invitedBy: invitedByUserId,
        expiresAt,
        status: "pending",
        token,
      },
    });
    const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/accept?organizationId=${organizationId}&token=${token}`;

    // Envoyer email d'invitation
    await sendInvitationEmail(email, {
      invitationLink: invitationLink,
      role: roleRecord.name,
      organizationName: organization.name,
    });

    return NextResponse.json({ message: "Invitation envoyée", invitation });
  } catch (error) {
    console.error("Erreur envoi invitation :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
