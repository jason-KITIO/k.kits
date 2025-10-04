import { cookies } from "next/headers";
import prisma from "./prisma";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session-token")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!session || !session.active || (session.expiresAt && session.expiresAt < new Date())) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}