import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  color: string;
  unitPrice: number;
  costPrice: number;
  weight?: number;
  dimensions?: string;
  minStock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
}

export function useProducts(organizationId: string) {
  return useQuery({
    queryKey: ["products", organizationId],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch(`/api/organization/${organizationId}/products`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      return response.json();
    },
    enabled: !!organizationId,
  });
}

export function useDeleteProduct(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/organization/${organizationId}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
      toast.success("Produit supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du produit");
    },
  });
}