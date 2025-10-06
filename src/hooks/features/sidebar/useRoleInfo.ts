import { useMemo } from "react";

interface RoleChecks {
  owner: boolean;
  manager: boolean;
  seller: boolean;
  stockManager: boolean;
}

interface PermissionChecks {
  manageUsers: boolean;
  inviteUsers: boolean;
  adjustStock: boolean;
  transferStock: boolean;
  viewReports: boolean;
  manageSettings: boolean;
}

export function useRoleInfo(is: RoleChecks, can: PermissionChecks) {
  return useMemo(() => ({
    isOwner: is.owner,
    isManager: is.manager,
    isSeller: is.seller,
    isStockManager: is.stockManager,
    canManageTeam: can.manageUsers || can.inviteUsers,
    canManageStock: can.adjustStock || can.transferStock,
    canViewReports: can.viewReports,
    canManageSettings: can.manageSettings,
  }), [is, can]);
}
