import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

export function useProduct(organizationId: string, productId: string) {
  return useQuery<Product>({
    queryKey: ["product", organizationId, productId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/products/${productId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Erreur lors du chargement du produit");
      return response.json();
    },
  });
}
