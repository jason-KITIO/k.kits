import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt";
import crypto from "crypto";
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
 * /api/auth/email/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Connexion par email avec OTP
 *     description: Envoie un code OTP par email pour la connexion sans mot de passe
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
 *       401:
 *         description: Email non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email ou mot de passe incorrect"
 *       403:
 *         description: Utilisateur banni ou email non vérifié
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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (user.banned) {
      return NextResponse.json(
        { message: "Utilisateur banni, accès refusé" },
        { status: 403 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { message: "Email non vérifié" },
        { status: 403 }
      );
    }

    // Vérifier si l'utilisateur ne s'est pas connecté depuis plus d'un mois
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const requiresOtp = !user.lastSignInAt || user.lastSignInAt < oneMonthAgo;

    if (requiresOtp) {
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

      return NextResponse.json({ 
        message: "Code OTP envoyé par email",
        requiresOtp: true 
      });
    }

    // Connexion directe sans OTP
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken,
        expiresAt,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastSignInAt: new Date() },
    });

    const cookieValue = `session_token=${sessionToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

    const response = NextResponse.json({ 
      message: "Connexion réussie",
      requiresOtp: false,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });

    response.headers.append("Set-Cookie", cookieValue);
    return response;
  } catch {
    console.error("Erreur envoi OTP");
    return NextResponse.json(
      { message: "Erreur serveur, veuillez réessayer plus tard" },
      { status: 500 }
    );
  }
}
