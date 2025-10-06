import { useOptimizedQuery } from '../../use-optimized-query';

type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  category?: {
    name: string;
  };
};

export const useSuppliers = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['suppliers', organizationId],
    queryFn: async (): Promise<Supplier[]> => {
      const response = await fetch(`/api/organization/${organizationId}/suppliers`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fournisseurs');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};

export const useProducts = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['products', organizationId],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch(`/api/organization/${organizationId}/products`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};
