import { useOptimizedQuery } from "./use-optimized-query";
import {
  LowStockItem,
  StockOverviewItem,
  StockValueResponse,
} from "@/types/dashboard";

export const useLowStock = (organizationId: string, threshold = 10) => {
  return useOptimizedQuery<LowStockItem[]>({
    queryKey: ["dashboard", "low-stock", organizationId, threshold],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/dashboard/low-stock?threshold=${threshold}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Erreur lors du chargement du stock faible");
      return response.json();
    },
    enabled: !!organizationId,
    cacheLevel: "CRITICAL", // Stock critique - cache court
  });
};

export const useStockOverview = (organizationId: string) => {
  return useOptimizedQuery<StockOverviewItem[]>({
    queryKey: ["dashboard", "stock-overview", organizationId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/dashboard/stock-overview`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Erreur lors du chargement de l'aperçu du stock");
      return response.json();
    },
    enabled: !!organizationId,
    cacheLevel: "FREQUENT", // Dashboard fréquent
  });
};

export const useStockValue = (organizationId: string) => {
  return useOptimizedQuery<StockValueResponse>({
    queryKey: ["dashboard", "stock-value", organizationId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/dashboard/stock-value`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Erreur lors du chargement de la valeur du stock");
      return response.json();
    },
    enabled: !!organizationId,
    cacheLevel: "FREQUENT", // Dashboard fréquent
  });
};
