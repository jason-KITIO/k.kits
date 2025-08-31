import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, CreateProductData, UpdateProductData } from "@/types/product";

export function useProducts(organizationId: string) {
  return useQuery<Product[]>({
    queryKey: ["products", organizationId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/products`,
        {
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement des produits");
      return response.json();
    },
  });
}

export function useCreateProduct(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const response = await fetch(
        `/api/organization/${organizationId}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok)
        throw new Error("Erreur lors de la création du produit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
    },
  });
}

export function useUpdateProduct(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductData;
    }) => {
      const response = await fetch(
        `/api/organization/${organizationId}/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour du produit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
    },
  });
}

export function useDeleteProduct(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `/api/organization/${organizationId}/products/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("Erreur lors de la suppression du produit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
    },
  });
}
