"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

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

function prefixUrl(base: string | null, path: string) {
  if (!base) return path;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = path.startsWith("/") ? path : "/" + path;
  return `${baseClean}${pathClean}`;
}

export function StoreSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Extraire orgId et storeId de l'URL
  const { orgId, storeId } = React.useMemo(() => {
    if (!pathname) return { orgId: null, storeId: null };
    const match = pathname.match(/\/preferences\/organizations\/([^\/]+)\/stores\/([^\/]+)/);
    return match ? { orgId: match[1], storeId: match[2] } : { orgId: null, storeId: null };
  }, [pathname]);

  const baseUrl = orgId && storeId ? `/preferences/organizations/${orgId}/stores/${storeId}` : null;

  const navMain = [
    {
      title: "Tableau de bord",
      url: prefixUrl(baseUrl, ""),
      icon: BarChart3,
    },
    {
      title: "Produits",
      url: prefixUrl(baseUrl, "/products"),
      icon: Package,
    },
    {
      title: "Stock",
      url: prefixUrl(baseUrl, "/stock"),
      icon: Warehouse,
    },
    {
      title: "Ventes",
      url: prefixUrl(baseUrl, "/sales"),
      icon: ShoppingCart,
    },
    {
      title: "Clients",
      url: prefixUrl(baseUrl, "/customers"),
      icon: Users,
    },
    {
      title: "Fournisseurs",
      url: prefixUrl(baseUrl, "/suppliers"),
      icon: Building2,
    },
    {
      title: "Transferts Stock",
      url: prefixUrl(baseUrl, "/stock-transfers"),
      icon: ArrowRightLeft,
    },
    {
      title: "Rapports",
      url: prefixUrl(baseUrl, "/reports"),
      icon: FileText,
    },
    {
      title: "Paramètres",
      url: prefixUrl(baseUrl, "/settings"),
      icon: Settings2,
    },
  ];

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