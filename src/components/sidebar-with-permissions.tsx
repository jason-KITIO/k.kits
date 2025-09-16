"use client";

import { useUserPermissions } from "@/hooks/use-auth-with-roles";
import { PERMISSIONS } from "@/lib/permissions";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  permission: string;
}

interface SidebarWithPermissionsProps {
  organizationId: string;
  menuItems: MenuItem[];
  children?: React.ReactNode;
}

export function SidebarWithPermissions({ 
  organizationId, 
  menuItems,
  children 
}: SidebarWithPermissionsProps) {
  const userPermissions = useUserPermissions(organizationId);

  const filteredMenuItems = menuItems.filter(item => 
    userPermissions.includes(item.permission) || userPermissions.includes("*")
  );

  return (
    <div className="flex">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          {filteredMenuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Menu items avec permissions
export const ORGANIZATION_MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    permission: PERMISSIONS.DASHBOARD_READ,
  },
  {
    label: "Ventes",
    href: "/sales", 
    permission: PERMISSIONS.SALE_READ,
  },
  {
    label: "Produits",
    href: "/products",
    permission: PERMISSIONS.PRODUCT_READ,
  },
  {
    label: "Stock",
    href: "/stock",
    permission: PERMISSIONS.STOCK_READ,
  },
  {
    label: "Boutiques",
    href: "/stores",
    permission: PERMISSIONS.ORG_SETTINGS,
  },
  {
    label: "Utilisateurs", 
    href: "/users",
    permission: PERMISSIONS.USER_MANAGE,
  },
];