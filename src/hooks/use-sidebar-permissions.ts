import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { usePermissions } from "./use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive: boolean;
  permission: string;
  badge?: string;
  description?: string;
}

export function useSidebarPermissions(organizationId?: string, baseUrl?: string) {
  const pathname = usePathname();
  const { can, is, hasPermission } = usePermissions(organizationId);

  const sidebarItems = useMemo(() => {
    const prefixUrl = (base: string | null, path: string) => {
      if (!base) return path;
      const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
      const pathClean = path.startsWith("/") ? path : "/" + path;
      return `${baseClean}${pathClean}`;
    };

    const allItems: SidebarItem[] = [
      {
        title: "Tableau de bord",
        url: prefixUrl(baseUrl || null, "/dashboard"),
        icon: require("lucide-react").BarChart3,
        isActive: pathname?.includes('/dashboard') || false,
        permission: PERMISSIONS.DASHBOARD_READ,
        description: "Vue d'ensemble de votre organisation"
      },
      {
        title: "Boutiques",
        url: prefixUrl(baseUrl || null, "/stores"),
        icon: require("lucide-react").Store,
        isActive: pathname?.includes('/stores') || false,
        permission: PERMISSIONS.ORG_SETTINGS,
        description: "Gérer vos points de vente"
      },
      {
        title: "Ventes",
        url: prefixUrl(baseUrl || null, "/sales"),
        icon: require("lucide-react").ShoppingCart,
        isActive: pathname?.includes('/sales') || false,
        permission: PERMISSIONS.SALE_READ,
        description: "Historique et gestion des ventes"
      },
      {
        title: "Notifications",
        url: prefixUrl(baseUrl || null, "/notifications"),
        icon: require("lucide-react").Bell,
        isActive: pathname?.includes('/notifications') || false,
        permission: PERMISSIONS.NOTIFICATION_READ,
        description: "Alertes et notifications système"
      },
      {
        title: "Équipes",
        url: prefixUrl(baseUrl || null, "/users"),
        icon: require("@solar-icons/react").User,
        isActive: pathname?.includes('/users') || false,
        permission: PERMISSIONS.USER_MANAGE,
        badge: is.owner ? "Admin" : undefined,
        description: "Gestion des membres de l'équipe"
      },
      {
        title: "Invitations",
        url: prefixUrl(baseUrl || null, "/invitation"),
        icon: require("lucide-react").Mail,
        isActive: pathname?.includes('/invitation') || false,
        permission: PERMISSIONS.USER_INVITE,
        description: "Inviter de nouveaux membres"
      },
      {
        title: "Rôles",
        url: prefixUrl(baseUrl || null, "/role"),
        icon: require("lucide-react").Settings2,
        isActive: pathname?.includes('/role') || false,
        permission: PERMISSIONS.USER_ROLES,
        badge: is.owner ? "Admin" : undefined,
        description: "Configuration des rôles et permissions"
      },
      {
        title: "Alertes Stock",
        url: prefixUrl(baseUrl || null, "/stock-alerts"),
        icon: require("lucide-react").AlertTriangle,
        isActive: pathname?.includes('/stock-alerts') || false,
        permission: PERMISSIONS.STOCK_READ,
        description: "Produits en rupture ou stock faible"
      },
      {
        title: "Transferts Stock",
        url: prefixUrl(baseUrl || null, "/stock-transfers"),
        icon: require("lucide-react").ArrowRightLeft,
        isActive: pathname?.includes('/stock-transfers') || false,
        permission: PERMISSIONS.STOCK_TRANSFER,
        description: "Mouvements entre boutiques et entrepôts"
      },
      {
        title: "Rapports",
        url: prefixUrl(baseUrl || null, "/reports"),
        icon: require("lucide-react").FileText,
        isActive: pathname?.includes('/reports') || false,
        permission: PERMISSIONS.REPORT_READ,
        description: "Analytics et rapports détaillés"
      },
      {
        title: "Paramètres",
        url: prefixUrl(baseUrl || null, "/settings"),
        icon: require("lucide-react").Settings2,
        isActive: pathname?.includes('/settings') || false,
        permission: PERMISSIONS.ORG_SETTINGS,
        badge: is.owner ? "Admin" : undefined,
        description: "Configuration de l'organisation"
      },
    ];

    // Filtrer selon les permissions
    return allItems.filter(item => hasPermission(item.permission));
  }, [pathname, baseUrl, hasPermission, is.owner]);

  const quickActions = useMemo(() => {
    const prefixUrl = (base: string | null, path: string) => {
      if (!base) return path;
      const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
      const pathClean = path.startsWith("/") ? path : "/" + path;
      return `${baseClean}${pathClean}`;
    };

    const allActions = [
      {
        name: "Nouvelle vente",
        url: prefixUrl(baseUrl || null, "/stores"),
        icon: require("lucide-react").ShoppingCart,
        permission: PERMISSIONS.SALE_CREATE,
      },
      {
        name: "Transfert stock",
        url: prefixUrl(baseUrl || null, "/stock-transfers"),
        icon: require("lucide-react").ArrowRightLeft,
        permission: PERMISSIONS.STOCK_TRANSFER,
      },
      {
        name: "Voir alertes",
        url: prefixUrl(baseUrl || null, "/stock-alerts"),
        icon: require("lucide-react").AlertTriangle,
        permission: PERMISSIONS.STOCK_READ,
      },
    ];

    return allActions.filter(action => hasPermission(action.permission));
  }, [baseUrl, hasPermission]);

  const roleInfo = useMemo(() => ({
    isOwner: is.owner,
    isManager: is.manager,
    isSeller: is.seller,
    isStockManager: is.stockManager,
    canManageTeam: can.manageUsers || can.inviteUsers,
    canManageStock: can.adjustStock || can.transferStock,
    canViewReports: can.viewReports,
    canManageSettings: can.manageSettings,
  }), [is, can]);

  return {
    sidebarItems,
    quickActions,
    roleInfo,
    permissions: { can, is, hasPermission }
  };
}