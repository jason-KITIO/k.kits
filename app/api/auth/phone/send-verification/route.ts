import { NextResponse, NextRequest } from "next/server";
import client from "@/lib/twilio";
import redis from "@/lib/redis";
import { generateVerificationSMS } from "@/template/sms-template";
import prisma from "@/lib/prisma"

/**
 * @swagger
 * /api/auth/phone/send-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Envoi d'un code de vérification par SMS
 *     description: Génère et envoie un code de vérification à 6 chiffres par SMS pour vérifier le numéro de téléphone
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\+[1-9]\\d{1,14}$"
 *                 description: Numéro de téléphone au format international
 *                 example: "+237123456789"
 *     responses:
 *       200:
 *         description: SMS envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SMS envoyé"
 *                 code:
 *                   type: string
 *                   description: Code de vérification (en mode développement)
 *                 userId:
 *                   type: string
 *                   description: ID de l'utilisateur
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Numéro de téléphone et token requis"
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
 *       409:
 *         description: Numéro déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ce numéro de téléphone est déjà utilisé"
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
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();
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

    // Vérifier si le téléphone est déjà utilisé par un autre utilisateur
    const existingUserWithPhone = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (existingUserWithPhone && existingUserWithPhone.id !== userId) {
      return NextResponse.json(
        { message: "Ce numéro de téléphone est déjà utilisé" },
        { status: 409 }
      );
    }

    if (!phoneNumber || !match) {
      return NextResponse.json(
        { message: "Numéro de téléphone et token requis" },
        { status: 400 }
      );
    }

    // Générer code 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Stocker le code dans Redis avec expiration 10 minutes (600 secondes)
    await redis.set(`${userId}:phoneVerification`, code, { ex: 600 });

    // Générer le message SMS
    const messageBody = generateVerificationSMS(code);

    // Envoyer le SMS via Twilio
    await client.messages.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: messageBody,
    });

    return NextResponse.json({ message: "SMS envoyé : ", code, userId });
  } catch {
    console.error("Erreur envoi SMS");
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
