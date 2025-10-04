"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { NavStore } from "@/components/nav-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  ArrowRightLeft,
  FileText,
  Settings2,
  Building2,
  LifeBuoy,
  Send,
  Tag,
} from "lucide-react";
import { SidebarSkeleton } from "@/components/sidebar-skeleton";

function prefixUrl(base: string | null, path: string) {
  if (!base) return path;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = path.startsWith("/") ? path : "/" + path;
  return `${baseClean}${pathClean}`;
}

export function ProtectedStoreSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Extraire orgId et storeId de l'URL
  const { orgId, storeId } = React.useMemo(() => {
    if (!pathname) return { orgId: null, storeId: null };
    const match = pathname.match(/\/preferences\/organizations\/([^\/]+)\/stores\/([^\/]+)/);
    return match ? { orgId: match[1], storeId: match[2] } : { orgId: null, storeId: null };
  }, [pathname]);

  const { can, is, hasPermission } = usePermissions(orgId || undefined);

  const baseUrl = orgId && storeId ? `/preferences/organizations/${orgId}/stores/${storeId}` : null;

  // Définir tous les éléments de navigation avec leurs permissions
  const allNavItems = [
    {
      title: "Tableau de bord",
      url: prefixUrl(baseUrl, ""),
      icon: BarChart3,
      permission: PERMISSIONS.DASHBOARD_READ,
    },

    {
      title: "Stock",
      url: prefixUrl(baseUrl, "/stock"),
      icon: Warehouse,
      permission: PERMISSIONS.STOCK_READ,
    },
    {
      title: "Ventes",
      url: prefixUrl(baseUrl, "/sales"),
      icon: ShoppingCart,
      permission: PERMISSIONS.SALE_READ,
    },
    {
      title: "Clients",
      url: prefixUrl(baseUrl, "/customers"),
      icon: Users,
      permission: PERMISSIONS.CUSTOMER_READ,
    },

    {
      title: "Transferts Stock",
      url: prefixUrl(baseUrl, "/stock-transfers"),
      icon: ArrowRightLeft,
      permission: PERMISSIONS.STOCK_TRANSFER,
    },
    {
      title: "Rapports",
      url: prefixUrl(baseUrl, "/reports"),
      icon: FileText,
      permission: PERMISSIONS.REPORT_READ,
    },
    {
      title: "Paramètres",
      url: prefixUrl(baseUrl, "/settings"),
      icon: Settings2,
      permission: PERMISSIONS.ORG_SETTINGS,
    },
  ];

  // Filtrer selon les permissions
  const navMain = allNavItems.filter(item => 
    hasPermission(item.permission) || is.owner
  );

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

  // État de chargement si pas de permissions encore
  if (!orgId || navMain.length === 0) {
    return <SidebarSkeleton />;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavStore />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}