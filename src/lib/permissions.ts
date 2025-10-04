// Permissions prédéfinies par resource
export const PERMISSIONS = {
  // Produits
  PRODUCT_CREATE: "product.create",
  PRODUCT_READ: "product.read", 
  PRODUCT_UPDATE: "product.update",
  PRODUCT_DELETE: "product.delete",
  
  // Stock
  STOCK_READ: "stock.read",
  STOCK_CREATE: "stock.create",
  STOCK_ADJUST: "stock.adjust",
  STOCK_TRANSFER: "stock.transfer",
  STOCK_INVENTORY: "stock.inventory",
  
  // Entrepôts
  WAREHOUSE_CREATE: "warehouse.create",
  WAREHOUSE_READ: "warehouse.read",
  WAREHOUSE_UPDATE: "warehouse.update",
  WAREHOUSE_DELETE: "warehouse.delete",
  
  // Ventes
  SALE_CREATE: "sale.create",
  SALE_READ: "sale.read",
  SALE_UPDATE: "sale.update", 
  SALE_REFUND: "sale.refund",
  
  // Commandes d'achat
  PURCHASE_ORDER_CREATE: "purchase_order.create",
  PURCHASE_ORDER_READ: "purchase_order.read",
  PURCHASE_ORDER_UPDATE: "purchase_order.update",
  
  // Notifications
  NOTIFICATION_READ: "notification.read",
  NOTIFICATION_CREATE: "notification.create",
  NOTIFICATION_UPDATE: "notification.update",
  
  // Dashboard & Rapports
  DASHBOARD_READ: "dashboard.read",
  REPORT_READ: "report.read",
  
  // Utilisateurs
  USER_INVITE: "user.invite",
  USER_MANAGE: "user.manage",
  USER_ROLES: "user.roles",
  
  // Clients
  CUSTOMER_CREATE: "customer.create",
  CUSTOMER_READ: "customer.read",
  CUSTOMER_UPDATE: "customer.update",
  CUSTOMER_DELETE: "customer.delete",
  
  // Organisation
  ORG_SETTINGS: "organization.settings",
  ORG_REPORTS: "organization.reports",
} as const;

// Rôles prédéfinis avec permissions
export const DEFAULT_ROLES = {
  OWNER: {
    name: "Propriétaire",
    permissions: Object.values(PERMISSIONS), // Toutes les permissions
    color: "#FF0000"
  },
  
  MANAGER: {
    name: "Gestionnaire", 
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.STOCK_READ,
      PERMISSIONS.STOCK_ADJUST,
      PERMISSIONS.WAREHOUSE_READ,
      PERMISSIONS.WAREHOUSE_CREATE,
      PERMISSIONS.SALE_READ,
      PERMISSIONS.CUSTOMER_READ,
      PERMISSIONS.CUSTOMER_CREATE,
      PERMISSIONS.USER_INVITE,
      PERMISSIONS.ORG_REPORTS
    ],
    color: "#FF6600"
  },
  
  VENDEUR: {
    name: "Vendeur",
    permissions: [
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.SALE_CREATE,
      PERMISSIONS.SALE_READ,
      PERMISSIONS.STOCK_READ,
      PERMISSIONS.CUSTOMER_READ,
      PERMISSIONS.CUSTOMER_CREATE
    ],
    color: "#00AA00"
  },
  
  MAGASINIER: {
    name: "Magasinier", 
    permissions: [
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.STOCK_READ,
      PERMISSIONS.STOCK_ADJUST,
      PERMISSIONS.STOCK_TRANSFER,
      PERMISSIONS.STOCK_INVENTORY,
      PERMISSIONS.WAREHOUSE_READ
    ],
    color: "#0066FF"
  }
} as const;

// Helper pour vérifier les permissions
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  // Le propriétaire a toutes les permissions
  return userPermissions.includes("*") || userPermissions.includes(requiredPermission);
}