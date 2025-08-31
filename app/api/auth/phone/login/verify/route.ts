import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import redis from "@/lib/redis";

const prisma = new PrismaClient();
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 jours en secondes
const OTP_REDIS_PREFIX = "otp_phone_";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Numéro et code OTP sont requis" },
        { status: 400 }
      );
    }

    const redisKey = OTP_REDIS_PREFIX + phone;
    const storedOtp = await redis.get(redisKey);
    console.log("Stored OTP:", typeof storedOtp, storedOtp);
    console.log("Received OTP:", typeof otp, otp);

    // Convertir storedOtp en string (dans le cas où ce serait un nombre)
    const storedOtpString =
      storedOtp !== null && storedOtp !== undefined ? String(storedOtp) : null;

    // Convertir otp reçu (au cas où ce ne serait pas une string)
    const otpString = typeof otp === "string" ? otp : String(otp);

    if (!storedOtpString || storedOtpString !== otpString) {
      return NextResponse.json(
        { message: "Code OTP invalide ou expiré" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const now = new Date();

    // Supprimer OTP de Redis (usage unique)
    await redis.del(redisKey);

    // Mettre à jour lastSignIn et créer session
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSignInAt: now },
    });

    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(now.getTime() + SESSION_EXPIRES_IN * 1000);

    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken,
        createdAt: now,
        lastActiveAt: now,
        expiresAt,
        active: true,
      },
    });

    const cookieValue =
      `session_token=${sessionToken}; HttpOnly; Path=/; Max-Age=${SESSION_EXPIRES_IN}; SameSite=Lax` +
      (process.env.NODE_ENV === "production" ? "; Secure" : "");

    const response = NextResponse.json({
      message: "Connexion réussie via OTP SMS",
      user,
    });

    response.headers.append("Set-Cookie", cookieValue);

    return response;
  } catch {
    console.error("Erreur vérification OTP SMS :", error);
    return NextResponse.json(
      { message: "Erreur serveur, veuillez réessayer plus tard" },
      { status: 500 }
    );
  }
}
