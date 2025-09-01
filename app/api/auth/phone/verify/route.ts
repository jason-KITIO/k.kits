import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/phone/verify:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Vérification du numéro de téléphone par code SMS
 *     description: Vérifie le code reçu par SMS et marque le numéro comme vérifié
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
 *               - code
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\+[1-9]\\d{1,14}$"
 *                 description: Numéro de téléphone au format international
 *                 example: "+33123456789"
 *               code:
 *                 type: string
 *                 pattern: "^[0-9]{6}$"
 *                 description: Code de vérification à 6 chiffres reçu par SMS
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Téléphone vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Téléphone vérifié avec succès"
 *       400:
 *         description: Données manquantes ou code invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code invalide"
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
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    // Extraire userId depuis le cookie session_token
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }
    const sessionToken = match[1];

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { message: "Numéro, code et token requis" },
        { status: 400 }
      );
    }
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
    console.log("ID utilisateur :", userId);

    const storedCodeRaw = await redis.get(`${userId}:phoneVerification`);
    if (!storedCodeRaw) {
      return NextResponse.json(
        { message: "Aucun code trouvé ou expiré" },
        { status: 400 }
      );
    }
    const storedCode = storedCodeRaw ? storedCodeRaw.toString().trim() : null;
    const userCode = code.toString().trim();

    console.log("Code stocké :", storedCode);
    console.log("Code utilisateur :", userCode);

    if (storedCode && storedCode === userCode) {
      await redis.del(`${userId}:phoneVerification`);
      // const updatedUser = await updateUserPhoneVerified(userId, phoneNumber);

      // if (updatedUser.emailVerified && updatedUser.phoneVerified) {
      //   await sendWelcomeEmail(updatedUser.email, updatedUser.firstName ?? "");
      // }

      return NextResponse.json({ message: "Téléphone vérifié avec succès" });
    } else {
      return NextResponse.json({ message: "Code invalide" }, { status: 400 });
    }
  } catch {
    console.error("Erreur vérification code");
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
