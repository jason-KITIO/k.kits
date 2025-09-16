import { PERMISSIONS } from "./permissions";

// Pages et leurs permissions requises
export const PAGE_PERMISSIONS = {
  "/preferences/organizations/[id]/dashboard": [PERMISSIONS.DASHBOARD_READ],
  "/preferences/organizations/[id]/stores": [PERMISSIONS.ORG_SETTINGS],
  "/preferences/organizations/[id]/users": [PERMISSIONS.USER_MANAGE],
  "/preferences/organizations/[id]/sales": [PERMISSIONS.SALE_READ],
  "/preferences/organizations/[id]/products": [PERMISSIONS.PRODUCT_READ],
  "/preferences/organizations/[id]/stock": [PERMISSIONS.STOCK_READ],
} as const;

// Page par défaut selon le rôle
export const DEFAULT_PAGES = {
  "Propriétaire": "/dashboard",
  "Gestionnaire": "/dashboard", 
  "Vendeur": "/sales",
  "Magasinier": "/stock",
} as const;

export function getDefaultPageForRole(roleName: string, organizationId: string): string {
  const basePage = DEFAULT_PAGES[roleName as keyof typeof DEFAULT_PAGES] || "/sales";
  return `/preferences/organizations/${organizationId}${basePage}`;
}

export function hasPageAccess(userPermissions: string[], pathname: string): boolean {
  const requiredPermissions = Object.entries(PAGE_PERMISSIONS).find(([pattern]) => 
    pathname.match(pattern.replace("[id]", "[^/]+"))
  )?.[1];
  
  if (!requiredPermissions) return true;
  
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission) || userPermissions.includes("*")
  );
}