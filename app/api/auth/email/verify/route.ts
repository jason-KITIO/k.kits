import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "@/lib/email";

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

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: true, updatedAt: new Date() },
    });

    if (updatedUser.emailVerified && updatedUser.phoneVerified) {
      await sendWelcomeEmail(updatedUser.email, updatedUser.firstName ?? "");
    }

    return NextResponse.json({ message: "Email vérifié avec succès" });
  } catch {
    console.error("Erreur vérification email");
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
