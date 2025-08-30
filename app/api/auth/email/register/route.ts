import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/email";
import { emailMagicLinkTemplate } from "@/template/email-magic-link";

/**
 * @swagger
 * /api/auth/email/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Inscription d'un nouvel utilisateur par email
 *     description: Crée un nouveau compte utilisateur et envoie un lien de vérification par email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur unique
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Mot de passe de l'utilisateur
 *                 example: "motdepasse123"
 *               firstName:
 *                 type: string
 *                 description: Prénom de l'utilisateur
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Nom de famille de l'utilisateur
 *                 example: "Doe"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé, mail de vérification envoyé"
 *       400:
 *         description: Données manquantes ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email, mot de passe et username sont requis"
 *       409:
 *         description: Email ou username déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email ou username déjà utilisé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne"
 */
export async function POST(request: Request) {
  try {
    const { email, username, password, firstName, lastName } =
      await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Email, mot de passe et username sont requis" },
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (userExist) {
      return NextResponse.json(
        { message: "Email ou username déjà utilisé" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        firstName,
        lastName,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register/verification/?token=${token}`;
    const emailHtml = emailMagicLinkTemplate(magicLink);

    await sendMagicLinkEmail(email, emailHtml);

    return NextResponse.json({
      message: "Utilisateur créé, mail de vérification envoyé",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
