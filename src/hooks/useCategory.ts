import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import type { categoryCreateInput, categoryUpdateInput } from "@/schema/category.schema";

export const useCategories = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "categories"],
    queryFn: () => categoryService.getCategories(organizationId),
    enabled: !!organizationId,
  });
};

export const useCategory = (organizationId: string, categoryId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "categories", categoryId],
    queryFn: () => categoryService.getCategory(organizationId, categoryId),
    enabled: !!organizationId && !!categoryId,
  });
};

export const useCreateCategory = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: categoryCreateInput) =>
      categoryService.createCategory(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "categories"],
      });
    },
  });
};

export const useUpdateCategory = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: categoryUpdateInput }) =>
      categoryService.updateCategory(organizationId, categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "categories", categoryId],
      });
    },
  });
};

export const useDeleteCategory = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      categoryService.deleteCategory(organizationId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "categories"],
      });
    },
  });
};