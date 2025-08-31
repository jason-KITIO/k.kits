import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryTree,
} from "@/types/category";
import * as categoryService from "@/services/category-service";

export function useCategories(organizationId: string) {
  return useQuery<Category[]>({
    queryKey: ["categories", organizationId],
    queryFn: () => categoryService.fetchCategories(organizationId),
  });
}

export function useCategoryTree(organizationId: string) {
  return useQuery<CategoryTree[]>({
    queryKey: ["categories", "tree", organizationId],
    queryFn: () => categoryService.fetchCategoryTree(organizationId),
  });
}

export function useCategory(organizationId: string, categoryId: string) {
  return useQuery<Category>({
    queryKey: ["categories", organizationId, categoryId],
    queryFn: () =>
      categoryService.fetchCategoryById(organizationId, categoryId),
    enabled: !!categoryId,
  });
}

export function useCreateCategory(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) =>
      categoryService.createCategory(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", "tree", organizationId],
      });
    },
  });
}

export function useUpdateCategory(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      categoryService.updateCategory(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", "tree", organizationId],
      });
    },
  });
}

export function useDeleteCategory(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      categoryService.deleteCategory(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", "tree", organizationId],
      });
    },
  });
}
