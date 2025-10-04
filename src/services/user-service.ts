import { PrismaClient, User } from "@prisma/client";
import type { UpdateUserProfile } from "@/schema/user-settings.schema";
const prisma = new PrismaClient();

const API_BASE = "/api";

export async function getUserBySessionToken(
  sessionToken: string
): Promise<User | null> {
  const session = await prisma.userSession.findFirst({
    where: {
      sessionToken,
      active: true,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!session || !session.user) return null;

  return session.user;
}

export const userService = {
  // Récupérer le profil de l'utilisateur connecté
  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`);
    if (!response.ok) throw new Error("Erreur lors du chargement du profil");
    const data = await response.json();
    return data.user;
  },

  // Mettre à jour le profil de l'utilisateur connecté
  async updateProfile(data: UpdateUserProfile): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil");
    const result = await response.json();
    return result.user;
  },
};
