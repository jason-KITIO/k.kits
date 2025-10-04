import { useOptimizedQuery } from './use-optimized-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryCreateInput, categoryUpdateInput } from '@/schema/category.schema';

type Category = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  active: boolean;
  organizationId: string;
  _count?: {
    products: number;
  };
};

export const useCategories = (organizationId: string, storeId: string) => {
  return useOptimizedQuery({
    queryKey: ['categories', organizationId, storeId],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/categories`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      return response.json();
    },
  });
};

export const useCategory = (organizationId: string, storeId: string, id: string) => {
  return useOptimizedQuery({
    queryKey: ['category', organizationId, storeId, id],
    queryFn: async (): Promise<Category> => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/categories/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      return response.json();
    },
  });
};

export const useCreateCategory = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: categoryCreateInput): Promise<Category> => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', organizationId, storeId] });
    },
  });
};

export const useUpdateCategory = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: categoryUpdateInput }): Promise<Category> => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', organizationId, storeId] });
    },
  });
};

export const useDeleteCategory = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', organizationId, storeId] });
    },
  });
};