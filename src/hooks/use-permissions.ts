import { useUserPermissions } from "./use-auth-with-roles";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * Hook pour vérifier facilement les permissions dans les composants
 */
export function usePermissions(organizationId?: string) {
  const userPermissions = useUserPermissions(organizationId);

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission) || userPermissions.includes("*");
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Permissions spécifiques pour faciliter l'usage
  const can = {
    // Dashboard
    viewDashboard: hasPermission(PERMISSIONS.DASHBOARD_READ),
    
    // Produits
    createProduct: hasPermission(PERMISSIONS.PRODUCT_CREATE),
    viewProducts: hasPermission(PERMISSIONS.PRODUCT_READ),
    updateProduct: hasPermission(PERMISSIONS.PRODUCT_UPDATE),
    deleteProduct: hasPermission(PERMISSIONS.PRODUCT_DELETE),
    
    // Stock
    viewStock: hasPermission(PERMISSIONS.STOCK_READ),
    adjustStock: hasPermission(PERMISSIONS.STOCK_ADJUST),
    transferStock: hasPermission(PERMISSIONS.STOCK_TRANSFER),
    manageInventory: hasPermission(PERMISSIONS.STOCK_INVENTORY),
    
    // Ventes
    createSale: hasPermission(PERMISSIONS.SALE_CREATE),
    viewSales: hasPermission(PERMISSIONS.SALE_READ),
    updateSale: hasPermission(PERMISSIONS.SALE_UPDATE),
    refundSale: hasPermission(PERMISSIONS.SALE_REFUND),
    
    // Utilisateurs
    inviteUsers: hasPermission(PERMISSIONS.USER_INVITE),
    manageUsers: hasPermission(PERMISSIONS.USER_MANAGE),
    manageRoles: hasPermission(PERMISSIONS.USER_ROLES),
    
    // Organisation
    manageSettings: hasPermission(PERMISSIONS.ORG_SETTINGS),
    viewReports: hasPermission(PERMISSIONS.REPORT_READ),
    
    // Clients
    createCustomer: hasPermission(PERMISSIONS.CUSTOMER_CREATE),
    viewCustomers: hasPermission(PERMISSIONS.CUSTOMER_READ),
    updateCustomer: hasPermission(PERMISSIONS.CUSTOMER_UPDATE),
    deleteCustomer: hasPermission(PERMISSIONS.CUSTOMER_DELETE),
    
    // Notifications
    viewNotifications: hasPermission(PERMISSIONS.NOTIFICATION_READ),
  };

  // Rôles simplifiés pour l'UI
  const is = {
    owner: userPermissions.includes("*") || hasPermission("*"),
    manager: hasAnyPermission([
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.USER_INVITE,
      PERMISSIONS.ORG_REPORTS
    ]) && !userPermissions.includes("*"),
    seller: hasAnyPermission([
      PERMISSIONS.SALE_CREATE,
      PERMISSIONS.CUSTOMER_CREATE
    ]) && !can.manageUsers && !userPermissions.includes("*"),
    stockManager: hasAnyPermission([
      PERMISSIONS.STOCK_ADJUST,
      PERMISSIONS.STOCK_TRANSFER
    ]) && !can.manageUsers && !userPermissions.includes("*"),
  };

  return {
    permissions: userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    is,
  };
}

/**
 * Hook pour les permissions conditionnelles dans le JSX
 */
export function useConditionalRender(organizationId?: string) {
  const { can, is } = usePermissions(organizationId);

  const renderIf = (condition: boolean, component: React.ReactNode) => {
    return condition ? component : null;
  };

  const renderIfCan = (permission: keyof typeof can, component: React.ReactNode) => {
    return renderIf(can[permission], component);
  };

  const renderIfIs = (role: keyof typeof is, component: React.ReactNode) => {
    return renderIf(is[role], component);
  };

  return {
    renderIf,
    renderIfCan,
    renderIfIs,
    can,
    is,
  };
}