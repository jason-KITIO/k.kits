"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { LifeBuoy, Send, Store, Mail, Edit, Warehouse } from "lucide-react";

import { NavMain } from "@/components/preferences/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
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

function markActive(items: NavItem[], currentPath: string): NavItem[] {
  return items.map((item) => {
    // L’item est actif si currentPath commence par son url
    const isActive = currentPath.startsWith(item.url);
    const newItem = { ...item, isActive };
    // Traitement récursif pour sous-menus
    if (item.items) {
      newItem.items = markActive(item.items, currentPath);
      if (newItem.items.some((i) => i.isActive)) {
        newItem.isActive = true;
      }
    }
    return newItem;
  });
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Extraire l'id organisation dans l'URL type /organizations/{id}/...
  const orgId = React.useMemo(() => {
    if (!pathname) return null;
    const match = pathname.match(/\/organizations\/([^\/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  // Construire base url /organizations/{id} ou null
  const baseUrl = orgId ? `/organizations/${orgId}` : null;

  // Données menus avec URLs dynamiques préfixées par organisation
  const navMain = [
    {
      title: "Authentification 2FA",
      url: "/legacy-2FA",
      icon: User,
      isActive: pathname === "/legacy-2FA",
    },
    {
      title: "Personnalisation",
      url: "/personalisation",
      icon: Edit,
      isActive: pathname === "/personalisation",
    },
    {
      title: "Invitations",
      url: "/invitation",
      icon: Mail,
      isActive: pathname === "/invitation",
    },
    {
      title: "Organisations",
      url: "/organizations",
      icon: Store,
      isActive: pathname === "/organizations",
    },
    {
      title: "Entrepôts",
      url: "/warehouses",
      icon: Warehouse,
      isActive: pathname === "/warehouses",
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
