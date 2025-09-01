"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Box,
  Building2,
  AlertTriangle,
  ArrowRightLeft,
  ClipboardList,
  Package,
  ShoppingCart,
  Truck,
  Settings2,
  LifeBuoy,
  Send,
  FileText,
  TrendingUp,
  Bell,
  Search,
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
      title: "Tableau de bord",
      url: prefixUrl(baseUrl, "/dashboard"),
      icon: BarChart3,
      isActive: true,
      // items: [
      //   {
      //     title: "Vue d'ensemble",
      //     url: prefixUrl(baseUrl, "/dashboard/overview"),
      //   },
      //   {
      //     title: "Stock bas",
      //     url: prefixUrl(baseUrl, "/dashboard/low-stock"),
      //   },
      //   {
      //     title: "Mouvements récents",
      //     url: prefixUrl(baseUrl, "/dashboard/recent-movements"),
      //   },
      //   {
      //     title: "Valeur du stock",
      //     url: prefixUrl(baseUrl, "/dashboard/stock-value"),
      //   },
      // ],
    },
    {
      title: "Produits",
      url: prefixUrl(baseUrl, "/products"),
      icon: Package,
      items: [
        { title: "Mes Produits", url: prefixUrl(baseUrl, "/products") },
        {
          title: "Catégories",
          url: prefixUrl(baseUrl, "/products/categories"),
        },
        {
          title: "Codes-barres",
          url: prefixUrl(baseUrl, "/products/barcodes"),
        },
      ],
    },
    {
      title: "Entrepôts",
      url: prefixUrl(baseUrl, "/warehouses"),
      icon: Building2,
      items: [
        { title: "Mes entrepôts", url: prefixUrl(baseUrl, "/warehouses") },
        {
          title: "Stock entrepôts",
          url: prefixUrl(baseUrl, "/warehouses/stock"),
        },
        {
          title: "Emplacements",
          url: prefixUrl(baseUrl, "/warehouses/locations"),
        },
        {
          title: "Gestionnaires",
          url: prefixUrl(baseUrl, "/warehouses/managers"),
        },
      ],
    },
    {
      title: "Mon Stock",
      url: prefixUrl(baseUrl, "/employee-stock"),
      icon: Box,
      items: [
        { title: "Mon inventaire", url: prefixUrl(baseUrl, "/employee-stock") },
        {
          title: "Mes demandes",
          url: prefixUrl(baseUrl, "/employee-stock/requests"),
        },
        {
          title: "Ajustements",
          url: prefixUrl(baseUrl, "/employee-stock/adjustments"),
        },
      ],
    },
    {
      title: "Transferts",
      url: prefixUrl(baseUrl, "/transfers"),
      icon: ArrowRightLeft,
      items: [
        {
          title: "Nouveaux transferts",
          url: prefixUrl(baseUrl, "/transfers/create"),
        },
        { title: "En attente", url: prefixUrl(baseUrl, "/transfers/pending") },
        {
          title: "Mes demandes",
          url: prefixUrl(baseUrl, "/transfers/my-requests"),
        },
        { title: "Historique", url: prefixUrl(baseUrl, "/transfers/history") },
      ],
    },
    {
      title: "Inventaires",
      url: prefixUrl(baseUrl, "/inventories"),
      icon: ClipboardList,
      items: [
        {
          title: "Inventaires actifs",
          url: prefixUrl(baseUrl, "/inventories"),
        },
        {
          title: "Planifier",
          url: prefixUrl(baseUrl, "/inventories/schedule"),
        },
        {
          title: "Historique",
          url: prefixUrl(baseUrl, "/inventories/history"),
        },
        { title: "Rapports", url: prefixUrl(baseUrl, "/inventories/reports") },
      ],
    },
    {
      title: "Achats",
      url: prefixUrl(baseUrl, "/purchases"),
      icon: ShoppingCart,
      items: [
        { title: "Commandes", url: prefixUrl(baseUrl, "/purchases/orders") },
        {
          title: "Créer commande",
          url: prefixUrl(baseUrl, "/purchases/create"),
        },
        { title: "Réceptions", url: prefixUrl(baseUrl, "/purchases/receipts") },
        {
          title: "Fournisseurs",
          url: prefixUrl(baseUrl, "/purchases/suppliers"),
        },
      ],
    },
    {
      title: "Fournisseurs",
      url: prefixUrl(baseUrl, "/suppliers"),
      icon: Truck,
      items: [
        { title: "Liste fournisseurs", url: prefixUrl(baseUrl, "/suppliers") },
        {
          title: "Ajouter fournisseur",
          url: prefixUrl(baseUrl, "/suppliers/create"),
        },
        { title: "Contacts", url: prefixUrl(baseUrl, "/suppliers/contacts") },
        {
          title: "Performance",
          url: prefixUrl(baseUrl, "/suppliers/performance"),
        },
      ],
    },
    {
      title: "Alertes",
      url: prefixUrl(baseUrl, "/alerts"),
      icon: AlertTriangle,
      items: [
        { title: "Stock bas", url: prefixUrl(baseUrl, "/alerts/low-stock") },
        { title: "Ruptures", url: prefixUrl(baseUrl, "/alerts/out-of-stock") },
        { title: "Surstock", url: prefixUrl(baseUrl, "/alerts/overstock") },
        {
          title: "Notifications",
          url: prefixUrl(baseUrl, "/alerts/notifications"),
        },
      ],
    },
    {
      title: "Rapports",
      url: prefixUrl(baseUrl, "/reports"),
      icon: FileText,
      items: [
        { title: "Stock général", url: prefixUrl(baseUrl, "/reports/stock") },
        { title: "Mouvements", url: prefixUrl(baseUrl, "/reports/movements") },
        {
          title: "Performance",
          url: prefixUrl(baseUrl, "/reports/performance"),
        },
        { title: "Export données", url: prefixUrl(baseUrl, "/reports/export") },
      ],
    },
    {
      title: "Paramètres",
      url: prefixUrl(baseUrl, "/settings"),
      icon: Settings2,
      items: [
        { title: "Général", url: prefixUrl(baseUrl, "/settings/general") },
        { title: "Utilisateurs", url: prefixUrl(baseUrl, "/settings/users") },
        {
          title: "Permissions",
          url: prefixUrl(baseUrl, "/settings/permissions"),
        },
        {
          title: "Organisation",
          url: prefixUrl(baseUrl, "/settings/organization"),
        },
      ],
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
      name: "Recherche rapide",
      url: prefixUrl(baseUrl, "/search"),
      icon: Search,
    },
    {
      name: "Entrée de stock",
      url: prefixUrl(baseUrl, "/quick/stock-in"),
      icon: TrendingUp,
    },
    {
      name: "Transfert rapide",
      url: prefixUrl(baseUrl, "/quick/transfer"),
      icon: ArrowRightLeft,
    },
    {
      name: "Alerte stock",
      url: prefixUrl(baseUrl, "/quick/alert"),
      icon: Bell,
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
