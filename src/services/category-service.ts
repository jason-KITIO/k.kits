import { api } from "./api";
import type { categoryCreateInput, categoryUpdateInput } from "@/schema/category.schema";

export const categoryService = {
  getCategories: async (organizationId: string) => {
    return await api.get(`/organization/${organizationId}/categories`);
  },

  getCategory: async (organizationId: string, categoryId: string) => {
    return await api.get(`/organization/${organizationId}/categories/${categoryId}`);
  },

  createCategory: async (organizationId: string, data: categoryCreateInput) => {
    return await api.post(`/organization/${organizationId}/categories`, data);
  },

  updateCategory: async (organizationId: string, categoryId: string, data: categoryUpdateInput) => {
    return await api.put(`/organization/${organizationId}/categories/${categoryId}`, data);
  },

  deleteCategory: async (organizationId: string, categoryId: string) => {
    return await api.delete(`/organization/${organizationId}/categories/${categoryId}`);
  },
};