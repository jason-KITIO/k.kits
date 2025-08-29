import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const SESSION_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 jours en secondes
const SESSION_RENEWAL_THRESHOLD = 60 * 60 * 24 * 7; // Renouveler si expire dans moins de 7 jours

/**
 * Parse les cookies depuis le header HTTP
 * @param cookieHeader - Header Cookie de la requête
 * @returns Objet contenant les cookies parsés
 */
function parseCookies(
  cookieHeader: string | null | undefined
): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [key, ...v] = pair.trim().split("=");
    cookies[key] = decodeURIComponent(v.join("="));
  }
  return cookies;
}

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Validation et renouvellement de session
 *     description: Vérifie la validité de la session utilisateur et la renouvelle automatiquement si nécessaire
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session valide ou renouvelée
 *         headers:
 *           Set-Cookie:
 *             description: Nouveau cookie de session (si renouvelée)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session valide"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       401:
 *         description: Session manquante, invalide ou expirée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session manquante. Veuillez vous reconnecter."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur, veuillez réessayer plus tard."
 */
export async function GET(request: NextRequest) {
  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionToken = cookies["session_token"];

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Session manquante. Veuillez vous reconnecter." },
      { status: 401 }
    );
  }

  try {
    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Session invalide ou expirée. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    const now = new Date();
    const timeToExpire = (session.expiresAt!.getTime() - now.getTime()) / 1000;

    if (timeToExpire < SESSION_RENEWAL_THRESHOLD) {
      const newSessionToken = crypto.randomUUID();
      const newExpiresAt = new Date(now.getTime() + SESSION_EXPIRES_IN * 1000);

      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          sessionToken: newSessionToken,
          expiresAt: newExpiresAt,
          lastActiveAt: now,
        },
      });

      const cookieValue =
        `session_token=${newSessionToken}; HttpOnly; Path=/; Max-Age=${SESSION_EXPIRES_IN}; SameSite=Lax` +
        (process.env.NODE_ENV === "production" ? "; Secure" : "");

      const response = NextResponse.json({
        message: "Session renouvelée",
        user: {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
        },
      });

      response.headers.append("Set-Cookie", cookieValue);

      return response;
    } else {
      await prisma.userSession.update({
        where: { id: session.id },
        data: { lastActiveAt: now },
      });

      return NextResponse.json({
        message: "Session valide",
        user: session.user,
      });
    }
  } catch (error) {
    console.error("Erreur gestion session :", error);
    return NextResponse.json(
      { message: "Erreur serveur, veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}
