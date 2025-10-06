import { useMemo } from "react";

export function useFilteredNavigation(
  allNavItems: any[],
  allQuickActions: any[],
  userPermissions: string[],
  isOwner: boolean
) {
  const hasPermission = (permission: string) => {
    return userPermissions.includes("*") || userPermissions.includes(permission);
  };

  const navMain = useMemo(() => {
    if (userPermissions.includes("*")) return allNavItems;
    if (userPermissions.length > 0) return allNavItems.filter((item) => hasPermission(item.permission));
    return [allNavItems[0]];
  }, [allNavItems, userPermissions]);

  const navMainWithBadges = useMemo(() => 
    navMain.map((item) => ({
      ...item,
      badge: item.badge || (isOwner && ["Equipes", "Rôles", "Paramètres"].includes(item.title) ? "Admin" : undefined),
    })),
    [navMain, isOwner]
  );

  const quickActions = useMemo(() => {
    if (userPermissions.includes("*")) return allQuickActions;
    return allQuickActions.filter((action) => hasPermission(action.permission));
  }, [allQuickActions, userPermissions]);

  return { navMainWithBadges, quickActions };
}
