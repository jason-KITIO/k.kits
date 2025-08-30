import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

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
