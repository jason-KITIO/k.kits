import prisma from "@/lib/prisma";

export async function checkUserPermission(
  sessionToken: string,
  organizationId: string,
  requiredPermission: string
): Promise<{ hasAccess: boolean; user?: any; membership?: any }> {
  try {
    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            organizationMembers: {
              where: { 
                organizationId,
                active: true 
              },
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      where: { active: true },
                      include: {
                        permission: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!session?.user) {
      return { hasAccess: false };
    }

    const membership = session.user.organizationMembers[0];
    if (!membership) {
      return { hasAccess: false };
    }

    const permissions = membership.role.rolePermissions.map(rp => rp.permission.name);
    
    // Vérifier les permissions : wildcard (*) ou permission spécifique ou rôle Propriétaire
    const hasAccess = permissions.includes("*") || 
                     permissions.includes(requiredPermission) || 
                     membership.role.name === "Propriétaire";

    return { 
      hasAccess, 
      user: session.user, 
      membership 
    };
  } catch (error) {
    console.error("Erreur vérification permission:", error);
    return { hasAccess: false };
  }
}