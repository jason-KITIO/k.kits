import { useMemo } from "react";
import { BarChart3, Building2, AlertTriangle, ArrowRightLeft, ShoppingCart, Settings2, LifeBuoy, Send, FileText, Bell, Store, Warehouse, Package, Tag } from "lucide-react";
import { User } from "@solar-icons/react";
import { PERMISSIONS } from "@/lib/permissions";

export function useSidebarNavigation(baseUrl: string | null, pathname: string, isOwner: boolean) {
  const prefixUrl = (base: string | null, path: string) => {
    if (!base) return path;
    const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
    const pathClean = path.startsWith("/") ? path : "/" + path;
    return `${baseClean}${pathClean}`;
  };

  const allNavItems = useMemo(() => [
    { title: "Tableau de bord", url: prefixUrl(baseUrl, "/dashboard"), icon: BarChart3, isActive: pathname?.includes("/dashboard"), permission: PERMISSIONS.DASHBOARD_READ, badge: null },
    { title: "Boutiques", url: prefixUrl(baseUrl, "/stores"), icon: Store, isActive: pathname?.includes("/stores"), permission: PERMISSIONS.ORG_SETTINGS, badge: null },
    { title: "Entrepôts", url: prefixUrl(baseUrl, "/warehouses"), icon: Warehouse, isActive: pathname?.includes("/warehouses"), permission: PERMISSIONS.STOCK_READ, badge: null },
    { title: "Produits", url: prefixUrl(baseUrl, "/products"), icon: Package, isActive: pathname?.includes("/products"), permission: PERMISSIONS.PRODUCT_READ, badge: null },
    { title: "Catégories", url: prefixUrl(baseUrl, "/categories"), icon: Tag, isActive: pathname?.includes("/categories"), permission: PERMISSIONS.PRODUCT_READ, badge: null },
    { title: "Fournisseurs", url: prefixUrl(baseUrl, "/suppliers"), icon: Building2, isActive: pathname?.includes("/suppliers"), permission: PERMISSIONS.PRODUCT_READ, badge: null },
    { title: "Ventes", url: prefixUrl(baseUrl, "/sales"), icon: ShoppingCart, isActive: pathname?.includes("/sales"), permission: PERMISSIONS.SALE_READ, badge: null },
    { title: "Alertes", url: prefixUrl(baseUrl, "/alerts"), icon: Bell, isActive: pathname?.includes("/alerts"), permission: PERMISSIONS.NOTIFICATION_READ, badge: null },
    { title: "Equipes", url: prefixUrl(baseUrl, "/users"), icon: User, isActive: pathname?.includes("/users"), permission: PERMISSIONS.USER_MANAGE, badge: isOwner ? "Admin" : null },
    { title: "Transferts Stock", url: prefixUrl(baseUrl, "/stock-transfers"), icon: ArrowRightLeft, isActive: pathname?.includes("/stock-transfers"), permission: PERMISSIONS.STOCK_TRANSFER, badge: null },
    { title: "Rapports", url: prefixUrl(baseUrl, "/reports"), icon: FileText, isActive: pathname?.includes("/reports"), permission: PERMISSIONS.REPORT_READ, badge: null },
    { title: "Paramètres", url: prefixUrl(baseUrl, "/settings"), icon: Settings2, isActive: pathname?.includes("/settings"), permission: PERMISSIONS.ORG_SETTINGS, badge: null },
  ], [baseUrl, pathname, isOwner]);

  const navSecondary = useMemo(() => [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ], []);

  const allQuickActions = useMemo(() => [
    { name: "Nouvelle vente", url: prefixUrl(baseUrl, "/stores"), icon: ShoppingCart, permission: PERMISSIONS.SALE_CREATE },
    { name: "Transfert stock", url: prefixUrl(baseUrl, "/stock-transfers"), icon: ArrowRightLeft, permission: PERMISSIONS.STOCK_TRANSFER },
    { name: "Voir alertes", url: prefixUrl(baseUrl, "/alerts"), icon: AlertTriangle, permission: PERMISSIONS.STOCK_READ },
  ], [baseUrl]);

  return { allNavItems, navSecondary, allQuickActions };
}
