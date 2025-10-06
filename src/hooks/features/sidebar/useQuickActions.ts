import { useMemo } from "react";
import { PERMISSIONS } from "@/lib/permissions";
import * as LucideIcons from "lucide-react";

const prefixUrl = (base: string | null, path: string) => {
  if (!base) return path;
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathClean = path.startsWith("/") ? path : "/" + path;
  return `${baseClean}${pathClean}`;
};

export function useQuickActions(baseUrl?: string, hasPermission?: (permission: string) => boolean) {
  return useMemo(() => {
    const allActions = [
      {
        name: "Nouvelle vente",
        url: prefixUrl(baseUrl || null, "/stores"),
        icon: LucideIcons.ShoppingCart,
        permission: PERMISSIONS.SALE_CREATE,
      },
      {
        name: "Transfert stock",
        url: prefixUrl(baseUrl || null, "/stock-transfers"),
        icon: LucideIcons.ArrowRightLeft,
        permission: PERMISSIONS.STOCK_TRANSFER,
      },
      {
        name: "Voir alertes",
        url: prefixUrl(baseUrl || null, "/stock-alerts"),
        icon: LucideIcons.AlertTriangle,
        permission: PERMISSIONS.STOCK_READ,
      },
    ];

    return hasPermission ? allActions.filter(action => hasPermission(action.permission)) : allActions;
  }, [baseUrl, hasPermission]);
}
