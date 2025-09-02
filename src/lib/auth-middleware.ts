import { NextRequest } from "next/server";
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";


export async function checkPermission(
  req: NextRequest,
  organizationId: string,
  requiredPermission: string
) {
  try {
    // 1. Récupérer l'utilisateur depuis la session/cookie
    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return { success: false, message: "Non authentifié", status: 401 };
    }

    // 2. Trouver l'utilisateur via sa session
    const session = await prisma.userSession.findUnique({
      where: { sessionToken, active: true },
      include: { user: true },
    });

    if (!session) {
      return { success: false, message: "Session invalide", status: 401 };
    }

    // 3. Récupérer les permissions de l'utilisateur dans cette organisation
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: session.userId,
        organizationId,
        active: true,
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // 4. Extraire toutes les permissions
    const userPermissions = userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.name)
    );

    // 5. Vérifier la permission
    const hasAccess =
      userPermissions.includes(requiredPermission) ||
      userPermissions.includes("*");

    if (!hasAccess) {
      return {
        success: false,
        message: "Permission insuffisante",
        status: 403,
      };
    }

    return {
      success: true,
      user: session.user,
      permissions: userPermissions,
    };
  } catch (error) {
    console.error("Erreur vérification permission:", error);
    return { success: false, message: "Erreur serveur", status: 500 };
  }
}
