import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendWelcomeEmail } from "@/lib/email";

const SESSION_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 jours

/**
 * @swagger
 * /api/auth/email/verify:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Vérification d'email par lien magique
 *     description: Vérifie l'adresse email de l'utilisateur à l'aide d'un token JWT
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT de vérification reçu par email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Email vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email vérifié avec succès"
 *       400:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token manquant"
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
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token manquant" }, { status: 400 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET non défini");
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    } catch {
      console.error("Erreur jwt.verify ");
      return NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    const now = new Date();
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { 
        emailVerified: true, 
        lastSignInAt: now,
        updatedAt: now 
      },
    });

    // Créer une session automatiquement
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(now.getTime() + SESSION_EXPIRES_IN * 1000);

    await prisma.userSession.create({
      data: {
        userId: updatedUser.id,
        sessionToken,
        expiresAt,
        createdAt: now,
        lastActiveAt: now,
        active: true,
      },
    });

    if (updatedUser.emailVerified && updatedUser.phoneVerified) {
      await sendWelcomeEmail(updatedUser.email, updatedUser.firstName ?? "");
    }

    const cookieValue = `session_token=${sessionToken}; HttpOnly; Path=/; Max-Age=${SESSION_EXPIRES_IN}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

    const response = NextResponse.json({ 
      message: "Email vérifié avec succès",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      }
    });

    response.headers.append("Set-Cookie", cookieValue);
    return response;
  } catch {
    console.error("Erreur vérification email");
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
