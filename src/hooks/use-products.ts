import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product-service";
import { toast } from "sonner";
import type { CreateProductData, UpdateProductData, ProductFilters } from "@/types/product";

export const useProducts = (organizationId: string, filters: Partial<ProductFilters> = {}) => {
  return useQuery({
    queryKey: ["products", organizationId, filters],
    queryFn: async () => await productService.getProducts(organizationId, filters),
    enabled: !!organizationId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (organizationId: string, productId: string) => {
  return useQuery({
    queryKey: ["product", organizationId, productId],
    queryFn: async () => await productService.getProduct(organizationId, productId),
    enabled: !!organizationId && !!productId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateProduct = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProductData) => 
      await productService.createProduct(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
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

export const useUpdateProduct = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: UpdateProductData }) =>
      await productService.updateProduct(organizationId, productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["product", organizationId, productId] });
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

export const useDeleteProduct = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => 
      await productService.deleteProduct(organizationId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
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