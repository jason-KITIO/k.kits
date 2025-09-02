import prisma from "@/lib/prisma"
import { PERMISSIONS, DEFAULT_ROLES } from "./permissions";

// Initialiser les permissions et rôles de base
export async function seedPermissions() {
  // 1. Créer toutes les permissions
  for (const [key, permission] of Object.entries(PERMISSIONS)) {
    const [resource, action] = permission.split('.');
    
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: {
        name: permission,
        resource,
        action,
        description: `Permission ${action} pour ${resource}`,
        active: true
      }
    });
  }

  // 2. Créer les rôles prédéfinis
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

    // 3. Assigner les permissions au rôle
    for (const permissionName of roleData.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      });

      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
            active: true
          }
        });
      }
    }
  }
}

// Lier tous les rôles par défaut à une organisation
export async function linkRolesToOrganization(organizationId: string) {
  for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
    const role = await prisma.role.findUnique({
      where: { name: roleData.name }
    });

    if (role) {
      await prisma.organizationRole.upsert({
        where: {
          roleId_organizationId: {
            roleId: role.id,
            organizationId
          }
        },
        update: {},
        create: {
          roleId: role.id,
          organizationId
        }
      });
    }
  }
}

// Assigner le rôle OWNER au créateur d'organisation
export async function assignOwnerRole(userId: string, organizationId: string) {
  const ownerRole = await prisma.role.findUnique({
    where: { name: "Propriétaire" }
  });

  if (ownerRole) {
    await prisma.userRole.create({
      data: {
        userId,
        roleId: ownerRole.id,
        organizationId,
        active: true
      }
    });
  }
}