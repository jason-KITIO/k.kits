import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useOptimisticMutations() {
  const queryClient = useQueryClient();

  // Mise à jour optimiste du stock
  const updateStockOptimistic = (
    organizationId: string,
    storeId: string,
    productId: string,
    quantityChange: number
  ) => {
    const queryKey = ["organization", organizationId, "stores", storeId, "stock"];
    
    queryClient.setQueryData(queryKey, (oldData: any[]) => {
      if (!oldData) return oldData;
      
      return oldData.map((stock) =>
        stock.productId === productId
          ? { ...stock, quantity: stock.quantity + quantityChange }
          : stock
      );
    });
  };

  // Mise à jour optimiste des ventes
  const addSaleOptimistic = (
    organizationId: string,
    storeId: string,
    newSale: any
  ) => {
    const queryKey = ["organization", organizationId, "stores", storeId, "sales"];
    
    queryClient.setQueryData(queryKey, (oldData: any[]) => {
      if (!oldData) return [newSale];
      return [newSale, ...oldData];
    });
  };

  // Invalidation intelligente (seulement les données liées)
  const invalidateRelatedQueries = (
    organizationId: string,
    storeId?: string,
    type?: "stock" | "sales" | "products"
  ) => {
    const baseKey = ["organization", organizationId];
    
    if (storeId) {
      baseKey.push("stores", storeId);
    }
    
    if (type) {
      queryClient.invalidateQueries({ queryKey: [...baseKey, type] });
    } else {
      queryClient.invalidateQueries({ queryKey: baseKey });
    }
    
    // Toujours invalider le dashboard
    queryClient.invalidateQueries({ 
      queryKey: ["organization", organizationId, "dashboard"] 
    });
  };

  return {
    updateStockOptimistic,
    addSaleOptimistic,
    invalidateRelatedQueries,
  };
}