import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import redis from "@/lib/redis"; // votre instance redis Upstash
import { sendOtpSms } from "@/lib/sms";

const prisma = new PrismaClient();
const OTP_VALIDITY_MINUTES = 10;
const OTP_REDIS_PREFIX = "otp_phone_";

/**
 * Génère un code OTP aléatoire
 * @param length - Longueur du code OTP (par défaut 6)
 * @returns Code OTP généré
 */
function generateOtp(length = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * @swagger
 * /api/auth/phone/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Connexion par numéro de téléphone avec OTP
 *     description: Authentifie l'utilisateur avec son numéro et mot de passe, puis envoie un code OTP par SMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 pattern: "^\\+[1-9]\\d{1,14}$"
 *                 description: Numéro de téléphone au format international
 *                 example: "+33123456789"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "motdepasse123"
 *     responses:
 *       200:
 *         description: Code OTP envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code OTP envoyé par SMS"
 *                 phone:
 *                   type: string
 *                   example: "+33123456789"
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Numéro de téléphone et mot de passe sont requis"
 *       401:
 *         description: Numéro ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Numéro ou mot de passe incorrect"
 *       403:
 *         description: Utilisateur banni ou numéro non vérifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur banni, accès refusé"
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
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { message: "Numéro de téléphone et mot de passe sont requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      // Réponse neutre pour ne pas révéler l'existence
      return NextResponse.json(
        { message: "Numéro ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (user.banned) {
      return NextResponse.json(
        { message: "Utilisateur banni, accès refusé" },
        { status: 403 }
      );
    }

    if (!user.phoneVerified) {
      return NextResponse.json(
        { message: "Numéro non vérifié" },
        { status: 403 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Numéro ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const otp = generateOtp();
    const redisKey = OTP_REDIS_PREFIX + phone;

    // Stocker OTP dans Redis avec expiration
    await redis.set(redisKey, otp, {
      ex: OTP_VALIDITY_MINUTES * 60,
    });

    await sendOtpSms(phone, otp);

    return NextResponse.json({
      message: "Code OTP envoyé par SMS",
      phone,
    });
  } catch {
    console.error("Erreur lors de la demande d'OTP");
    return NextResponse.json(
      { message: "Erreur serveur, veuillez réessayer plus tard" },
      { status: 500 }
    );
  }
}
