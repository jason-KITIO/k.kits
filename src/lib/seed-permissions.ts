import prisma from "@/lib/prisma"
import { PERMISSIONS, DEFAULT_ROLES } from "./permissions";

// Initialiser les permissions et rôles de base (optimisé)
export async function seedPermissions() {
  // Vérifier si les données de base existent déjà
  const existingPermissionsCount = await prisma.permission.count();
  const existingRolesCount = await prisma.role.count();
  
  // Si les permissions et rôles existent déjà, ne rien faire
  if (existingPermissionsCount > 0 && existingRolesCount > 0) {
    return;
  }

  // 1. Créer toutes les permissions en batch
  const permissionsToCreate = Object.values(PERMISSIONS).map(permission => {
    const [resource, action] = permission.split('.');
    return {
      name: permission,
      resource,
      action,
      description: `Permission ${action} pour ${resource}`,
      active: true
    };
  });

  await prisma.permission.createMany({
    data: permissionsToCreate,
    skipDuplicates: true
  });

  // 2. Créer les rôles et leurs permissions
  for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: {
        name: roleData.name,
        description: `Rôle ${roleData.name}`,
        color: roleData.color,
        active: true
      }
    });

    // 3. Récupérer toutes les permissions en une fois
    const permissions = await prisma.permission.findMany({
      where: { name: { in: [...roleData.permissions] } }
    });

    // 4. Créer les relations rôle-permission en batch
    const rolePermissions = permissions.map(permission => ({
      roleId: role.id,
      permissionId: permission.id,
      active: true
    }));

    await prisma.rolePermission.createMany({
      data: rolePermissions,
      skipDuplicates: true
    });
  }
}

// Lier tous les rôles par défaut à une organisation (optimisé)
export async function linkRolesToOrganization(organizationId: string) {
  // Récupérer tous les rôles en une fois
  const roles = await prisma.role.findMany({
    where: { 
      name: { in: Object.values(DEFAULT_ROLES).map(r => r.name) }
    }
  });

  // Créer toutes les relations en batch
  const organizationRoles = roles.map(role => ({
    roleId: role.id,
    organizationId
  }));

  await prisma.organizationRole.createMany({
    data: organizationRoles,
    skipDuplicates: true
  });
}

// Assigner le rôle OWNER au créateur d'organisation (optimisé)
export async function assignOwnerRole(userId: string, organizationId: string) {
  const ownerRole = await prisma.role.findUnique({
    where: { name: "Propriétaire" }
  });

  if (ownerRole) {
    // Utiliser une transaction pour créer les deux enregistrements en une fois
    await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          userId,
          organizationId,
          roleId: ownerRole.id,
          active: true
        }
      }),
      prisma.userRole.create({
        data: {
          userId,
          roleId: ownerRole.id,
          organizationId,
          active: true
        }
      })
    ]);
  }
}