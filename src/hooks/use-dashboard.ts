import { useQuery } from "@tanstack/react-query";
import {
  LowStockItem,
  StockOverviewItem,
  StockValueResponse,
} from "@/types/dashboard";

export function useLowStock(organizationId: string, threshold = 10) {
  return useQuery<LowStockItem[]>({
    queryKey: ["dashboard", "low-stock", organizationId, threshold],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/dashboard/low-stock?threshold=${threshold}`,
        { credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement du stock faible");
      return response.json();
    },
  });
}

export function useStockOverview(organizationId: string) {
  return useQuery<StockOverviewItem[]>({
    queryKey: ["dashboard", "stock-overview", organizationId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/dashboard/stock-overview`,
        { credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement de l'aperçu du stock");
      return response.json();
    },
  });
}

export function useStockValue(organizationId: string) {
  return useQuery<StockValueResponse>({
    queryKey: ["dashboard", "stock-value", organizationId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/dashboard/stock-value`,
        { credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement de la valeur du stock");
      return response.json();
    },
  });
}
