import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "./use-optimized-query";
import { productService } from "@/services/product-service";
import { toast } from "sonner";
import type { productCreateInput, productUpdateInput } from "@/schema/product.schema";

type ProductFilters = {
  categoryId?: string;
  supplierId?: string;
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export const useProducts = (organizationId: string, filters: Partial<ProductFilters> = {}, storeId?: string) => {
  return useOptimizedQuery({
    queryKey: ["products", organizationId, storeId, filters],
    queryFn: async () => await productService.getProducts(organizationId, filters, storeId),
    enabled: !!organizationId,
  });
};

export const useProduct = (organizationId: string, productId: string, storeId?: string) => {
  return useOptimizedQuery({
    queryKey: ["product", organizationId, storeId, productId],
    queryFn: async () => await productService.getProduct(organizationId, productId, storeId),
    enabled: !!organizationId && !!productId,
  });
};

export const useCreateProduct = (organizationId: string, storeId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: productCreateInput) => 
      await productService.createProduct(organizationId, data, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId, storeId] });
      toast.success("Succès", {
        description: "Produit créé avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useUpdateProduct = (organizationId: string, storeId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: productUpdateInput }) =>
      await productService.updateProduct(organizationId, productId, data, storeId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId, storeId] });
      queryClient.invalidateQueries({ queryKey: ["product", organizationId, storeId, productId] });
      toast.success("Succès", {
        description: "Produit modifié avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useDeleteProduct = (organizationId: string, storeId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => 
      await productService.deleteProduct(organizationId, productId, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId, storeId] });
      toast.success("Succès", {
        description: "Produit supprimé avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};