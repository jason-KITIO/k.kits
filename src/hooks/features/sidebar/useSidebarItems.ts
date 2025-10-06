import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/lib/permissions";
import * as LucideIcons from "lucide-react";
import * as SolarIcons from "@solar-icons/react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive: boolean;
  permission: string;
  badge?: string;
  description?: string;
}

const prefixUrl = (base: string | null, path: string) => {
  if (!base) return path;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = path.startsWith("/") ? path : "/" + path;
  return `${baseClean}${pathClean}`;
};

export function useSidebarItems(baseUrl?: string, hasPermission?: (permission: string) => boolean, isOwner?: boolean) {
  const pathname = usePathname();

  return useMemo(() => {
    const allItems: SidebarItem[] = [
      {
        title: "Tableau de bord",
        url: prefixUrl(baseUrl || null, "/dashboard"),
        icon: LucideIcons.BarChart3,
        isActive: pathname?.includes('/dashboard') || false,
        permission: PERMISSIONS.DASHBOARD_READ,
        description: "Vue d'ensemble de votre organisation"
      },
      {
        title: "Boutiques",
        url: prefixUrl(baseUrl || null, "/stores"),
        icon: LucideIcons.Store,
        isActive: pathname?.includes('/stores') || false,
        permission: PERMISSIONS.ORG_SETTINGS,
        description: "Gérer vos points de vente"
      },
      {
        title: "Ventes",
        url: prefixUrl(baseUrl || null, "/sales"),
        icon: LucideIcons.ShoppingCart,
        isActive: pathname?.includes('/sales') || false,
        permission: PERMISSIONS.SALE_READ,
        description: "Historique et gestion des ventes"
      },
      {
        title: "Notifications",
        url: prefixUrl(baseUrl || null, "/notifications"),
        icon: LucideIcons.Bell,
        isActive: pathname?.includes('/notifications') || false,
        permission: PERMISSIONS.NOTIFICATION_READ,
        description: "Alertes et notifications système"
      },
      {
        title: "Équipes",
        url: prefixUrl(baseUrl || null, "/users"),
        icon: SolarIcons.User,
        isActive: pathname?.includes('/users') || false,
        permission: PERMISSIONS.USER_MANAGE,
        badge: isOwner ? "Admin" : undefined,
        description: "Gestion des membres de l'équipe"
      },
      {
        title: "Invitations",
        url: prefixUrl(baseUrl || null, "/invitation"),
        icon: LucideIcons.Mail,
        isActive: pathname?.includes('/invitation') || false,
        permission: PERMISSIONS.USER_INVITE,
        description: "Inviter de nouveaux membres"
      },
      {
        title: "Rôles",
        url: prefixUrl(baseUrl || null, "/role"),
        icon: LucideIcons.Settings2,
        isActive: pathname?.includes('/role') || false,
        permission: PERMISSIONS.USER_ROLES,
        badge: isOwner ? "Admin" : undefined,
        description: "Configuration des rôles et permissions"
      },
      {
        title: "Alertes Stock",
        url: prefixUrl(baseUrl || null, "/stock-alerts"),
        icon: LucideIcons.AlertTriangle,
        isActive: pathname?.includes('/stock-alerts') || false,
        permission: PERMISSIONS.STOCK_READ,
        description: "Produits en rupture ou stock faible"
      },
      {
        title: "Transferts Stock",
        url: prefixUrl(baseUrl || null, "/stock-transfers"),
        icon: LucideIcons.ArrowRightLeft,
        isActive: pathname?.includes('/stock-transfers') || false,
        permission: PERMISSIONS.STOCK_TRANSFER,
        description: "Mouvements entre boutiques et entrepôts"
      },
      {
        title: "Rapports",
        url: prefixUrl(baseUrl || null, "/reports"),
        icon: LucideIcons.FileText,
        isActive: pathname?.includes('/reports') || false,
        permission: PERMISSIONS.REPORT_READ,
        description: "Analytics et rapports détaillés"
      },
      {
        title: "Paramètres",
        url: prefixUrl(baseUrl || null, "/settings"),
        icon: LucideIcons.Settings2,
        isActive: pathname?.includes('/settings') || false,
        permission: PERMISSIONS.ORG_SETTINGS,
        badge: isOwner ? "Admin" : undefined,
        description: "Configuration de l'organisation"
      },
    ];

    return hasPermission ? allItems.filter(item => hasPermission(item.permission)) : allItems;
  }, [pathname, baseUrl, hasPermission, isOwner]);
}
