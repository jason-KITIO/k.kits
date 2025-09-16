import { useAuth } from "@/providers/auth-provider";

interface UserWithRoles {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  organizationMembers: {
    id: string;
    organizationId: string;
    roleId: string;
    active: boolean;
    organization: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
      permissions: string[];
    };
  }[];
}

type AuthUser = UserWithRoles | null;

export const useAuthWithRoles = () => {
  console.warn("useAuthWithRoles is deprecated. Use useAuth from @/providers/auth-provider instead.");
  return useAuth();
};

export const useUserPermissions = (organizationId?: string) => {
  const { user } = useAuth();

  // console.log("🔐 useUserPermissions: Called with organizationId:", organizationId);
  // console.log("👤 useUserPermissions: User data:", user);

  if (!user) {
    // console.log("❌ useUserPermissions: No user data available");
    return [];
  }

  if (!organizationId) {
    // console.log("❌ useUserPermissions: No organizationId provided");
    return [];
  }

  if (!user.organizationMembers) {
    // console.log("❌ useUserPermissions: No organizationMembers in user data");
    return [];
  }

  // console.log("🏢 useUserPermissions: User organization members:", user.organizationMembers);

  const membership = user.organizationMembers.find(
    (member) => member.organizationId === organizationId && member.active
  );

  // console.log("🎯 useUserPermissions: Found membership:", membership);

  // Si le rôle est "Propriétaire" ou "Owner", retourner toutes les permissions
  if (membership?.role?.name === "Propriétaire" || membership?.role?.name === "Owner" || membership?.role?.name === "Propriétaire") {
    // console.log("👑 useUserPermissions: User is Owner/Propriétaire, granting all permissions");
    return ["*"]; // Wildcard pour toutes les permissions
  }

  const permissions = membership?.role?.permissions || [];
  // console.log("✅ useUserPermissions: Final permissions:", permissions);

  return permissions;
};

export const useHasPermission = (
  permission: string,
  organizationId?: string
) => {
  const permissions = useUserPermissions(organizationId);
  // Si l'utilisateur a le wildcard "*", il a toutes les permissions
  return permissions.includes("*") || permissions.includes(permission);
};
