import { usePermissions } from "../../use-permissions";
import { useSidebarItems } from "./useSidebarItems";
import { useQuickActions } from "./useQuickActions";
import { useRoleInfo } from "./useRoleInfo";

export function useSidebarPermissions(organizationId?: string, baseUrl?: string) {
  const { can, is, hasPermission } = usePermissions(organizationId);
  
  const sidebarItems = useSidebarItems(baseUrl, hasPermission, is.owner);
  const quickActions = useQuickActions(baseUrl, hasPermission);
  const roleInfo = useRoleInfo(is, can);

  return {
    sidebarItems,
    quickActions,
    roleInfo,
    permissions: { can, is, hasPermission }
  };
}

export type { SidebarItem } from "./useSidebarItems";
