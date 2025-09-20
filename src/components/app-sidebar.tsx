"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Building2,
  AlertTriangle,
  ArrowRightLeft,
  ShoppingCart,
  Settings2,
  LifeBuoy,
  Send,
  FileText,
  Bell,
  Mail,
  Store,
  Warehouse,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavOrganisation } from "./nav-organisation";
import { User } from "@solar-icons/react";
import { useUserPermissions } from "@/hooks/use-auth-with-roles";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

function prefixUrl(base: string | null, path: string) {
  // Préfixe l'url avec base si disponible, gère les slashs
  if (!base) return path;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = path.startsWith("/") ? path : "/" + path;
  return `${baseClean}${pathClean}`;
}

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType;
  isActive?: boolean;
  items?: NavItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // console.log("🔄 AppSidebar: Component mounted");
    setMounted(true);
  }, []);

  // Extraire l'id organisation dans l'URL type /preferences/organizations/{id}/...
  const orgId = React.useMemo(() => {
    // console.log("🔍 AppSidebar: Extracting orgId from pathname:", pathname);
    if (!pathname) {
      // console.log("❌ AppSidebar: No pathname available");
      return null;
    }
    const match = pathname.match(/\/preferences\/organizations\/([^\/]+)/);
    const extractedOrgId = match ? match[1] : null;
    // console.log("📋 AppSidebar: Extracted orgId:", extractedOrgId);
    return extractedOrgId;
  }, [pathname]);

  // Récupérer les permissions de l'utilisateur pour cette organisation
  const userPermissions = useUserPermissions(orgId || undefined);
  const { can, is } = usePermissions(orgId || undefined);
  
  // console.log("🔐 AppSidebar: User permissions for org", orgId, ":", userPermissions);
  // console.log("🎯 AppSidebar: Permission helpers:", { can, is });

  // Éviter l'erreur d'hydratation
  if (!mounted) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarContent>
          <div className="p-4 text-center text-sm text-muted-foreground">
            Chargement...
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Construire base url /organizations/{id} ou null
  const baseUrl = orgId ? `/preferences/organizations/${orgId}` : null;

  // Fonction pour vérifier si l'utilisateur a une permission
  const hasPermission = (permission: string) => {
    // Le propriétaire (wildcard *) a toutes les permissions
    return userPermissions.includes("*") || userPermissions.includes(permission);
  };

  // Données menus avec URLs dynamiques et vérification des permissions
  const allNavItems = [
    {
      title: "Tableau de bord",
      url: prefixUrl(baseUrl, "/dashboard"),
      icon: BarChart3,
      isActive: pathname?.includes('/dashboard'),
      permission: PERMISSIONS.DASHBOARD_READ,
      badge: null,
    },
    {
      title: "Boutiques",
      url: prefixUrl(baseUrl, "/stores"),
      icon: Store,
      isActive: pathname?.includes('/stores'),
      permission: PERMISSIONS.ORG_SETTINGS,
      badge: null,
    },
    {
      title: "Entrepôts",
      url: prefixUrl(baseUrl, "/warehouses"),
      icon: Warehouse,
      isActive: pathname?.includes('/warehouses'),
      permission: PERMISSIONS.STOCK_READ,
      badge: null,
    },
    {
      title: "Ventes",
      url: prefixUrl(baseUrl, "/sales"),
      icon: ShoppingCart,
      isActive: pathname?.includes('/sales'),
      permission: PERMISSIONS.SALE_READ,
      badge: null,
    },
    {
      title: "Notifications",
      url: prefixUrl(baseUrl, "/notifications"),
      icon: Bell,
      isActive: pathname?.includes('/notifications'),
      permission: PERMISSIONS.NOTIFICATION_READ,
      badge: null,
    },
    {
      title: "Equipes",
      url: prefixUrl(baseUrl, "/users"),
      icon: User,
      isActive: pathname?.includes('/users'),
      permission: PERMISSIONS.USER_MANAGE,
      badge: is.owner ? "Admin" : null,
    },
    {
      title: "Invitations",
      url: prefixUrl(baseUrl, "/invitation"),
      icon: Mail,
      isActive: pathname?.includes('/invitation'),
      permission: PERMISSIONS.USER_INVITE,
      badge: null,
    },
    {
      title: "Rôles",
      url: prefixUrl(baseUrl, "/role"),
      icon: Settings2,
      isActive: pathname?.includes('/role'),
      permission: PERMISSIONS.USER_ROLES,
      badge: is.owner ? "Admin" : null,
    },
    {
      title: "Alertes Stock",
      url: prefixUrl(baseUrl, "/stock-alerts"),
      icon: AlertTriangle,
      isActive: pathname?.includes('/stock-alerts'),
      permission: PERMISSIONS.STOCK_READ,
      badge: null,
    },
    {
      title: "Transferts Stock",
      url: prefixUrl(baseUrl, "/stock-transfers"),
      icon: ArrowRightLeft,
      isActive: pathname?.includes('/stock-transfers'),
      permission: PERMISSIONS.STOCK_TRANSFER,
      badge: null,
    },
    {
      title: "Rapports",
      url: prefixUrl(baseUrl, "/reports"),
      icon: FileText,
      isActive: pathname?.includes('/reports'),
      permission: PERMISSIONS.REPORT_READ,
      badge: null,
    },
    {
      title: "Paramètres",
      url: prefixUrl(baseUrl, "/settings"),
      icon: Settings2,
      isActive: pathname?.includes('/settings'),
      permission: PERMISSIONS.ORG_SETTINGS,
      badge: is.owner ? "Admin" : null,
    },
  ];

  // Filtrer les éléments de navigation selon les permissions
  // Le propriétaire (wildcard *) voit tout, sinon filtrer selon les permissions
  const navMain = userPermissions.includes("*")
    ? allNavItems // Propriétaire voit tous les éléments
    : userPermissions.length > 0 
      ? allNavItems.filter(item => hasPermission(item.permission))
      : [allNavItems[0]]; // Afficher au moins le tableau de bord

  // Ajouter des indicateurs de rôle pour certains éléments
  const navMainWithBadges = navMain.map(item => ({
    ...item,
    badge: item.badge || (is.owner && ['Equipes', 'Rôles', 'Paramètres'].includes(item.title) ? 'Admin' : undefined)
  }));

  const navSecondary = [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ];

  const allQuickActions = [
    {
      name: "Nouvelle vente",
      url: prefixUrl(baseUrl, "/stores"),
      icon: ShoppingCart,
      permission: PERMISSIONS.SALE_CREATE,
    },
    {
      name: "Transfert stock",
      url: prefixUrl(baseUrl, "/stock-transfers"),
      icon: ArrowRightLeft,
      permission: PERMISSIONS.STOCK_TRANSFER,
    },
    {
      name: "Voir alertes",
      url: prefixUrl(baseUrl, "/stock-alerts"),
      icon: AlertTriangle,
      permission: PERMISSIONS.STOCK_READ,
    },
  ];

  // Filtrer les actions rapides selon les permissions
  // Le propriétaire (wildcard *) voit toutes les actions
  const quickActions = userPermissions.includes("*")
    ? allQuickActions // Propriétaire voit toutes les actions
    : allQuickActions.filter(action => hasPermission(action.permission));


  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavOrganisation />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithBadges} />
        <NavProjects projects={quickActions} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
