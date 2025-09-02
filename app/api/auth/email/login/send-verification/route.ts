import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { sendOtpVerificationEmail } from "@/lib/email";

const OTP_VALIDITY_MINUTES = 10;

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
 * /api/auth/email/login/send-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Envoi d'un code OTP de vérification par email
 *     description: Génère et envoie un code OTP à 6 chiffres par email pour la connexion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
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
 *                   example: "Code OTP envoyé par email"
 *       400:
 *         description: Email manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email est requis"
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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email est requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: otp,
        verificationTokenExpiry: expiry,
      },
    });

    await sendOtpVerificationEmail(email, otp);

    return NextResponse.json({ message: "Code OTP envoyé par email" });
  } catch {
    console.error("Erreur envoi OTP");
    return NextResponse.json(
      { message: "Erreur serveur, veuillez réessayer plus tard" },
      { status: 500 }
    );
  }
}
