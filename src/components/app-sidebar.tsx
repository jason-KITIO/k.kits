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

  // Extraire l'id organisation dans l'URL type /preferences/organizations/{id}/...
  const orgId = React.useMemo(() => {
    if (!pathname) return null;
    const match = pathname.match(/\/preferences\/organizations\/([^\/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  // Construire base url /organizations/{id} ou null
  const baseUrl = orgId ? `/preferences/organizations/${orgId}` : null;

  // Données menus avec URLs dynamiques préfixées par organisation
  const navMain = [
    {
      title: "Tableau de bord",
      url: prefixUrl(baseUrl, "/dashboard"),
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Boutiques",
      url: prefixUrl(baseUrl, "/stores"),
      icon: Building2,
      items: [
        { title: "Mes boutiques", url: prefixUrl(baseUrl, "/stores") },
        { title: "Nouvelle boutique", url: prefixUrl(baseUrl, "/stores/new") },
      ],
    },
    {
      title: "Ventes",
      url: prefixUrl(baseUrl, "/sales"),
      icon: ShoppingCart,
    },
    {
      title: "Notifications",
      url: prefixUrl(baseUrl, "/notifications"),
      icon: Bell,
    },
    {
      title: "Equipes",
      url: prefixUrl(baseUrl, "/users"),
      icon: User,
    },
    {
      title: "Invitations",
      url: prefixUrl(baseUrl, "/invitation"),
      icon: Mail,
    },
    {
      title: "Rôles",
      url: prefixUrl(baseUrl, "/role"),
      icon: Settings2,
    },

    {
      title: "Alertes Stock",
      url: prefixUrl(baseUrl, "/stock-alerts"),
      icon: AlertTriangle,
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

  const quickActions = [
    {
      name: "Nouvelle vente",
      url: prefixUrl(baseUrl, "/stores"),
      icon: ShoppingCart,
    },
    {
      name: "Transfert stock",
      url: prefixUrl(baseUrl, "/stock-transfers"),
      icon: ArrowRightLeft,
    },
    {
      name: "Voir alertes",
      url: prefixUrl(baseUrl, "/stock-alerts"),
      icon: AlertTriangle,
    },
  ];

  // const quickActions = markActive(
  //   rawQuickActions.map((a) => ({ ...a, title: a.name })),
  //   pathname || ""
  // );
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavOrganisation />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={quickActions} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
