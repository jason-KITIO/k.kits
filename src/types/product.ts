import { z } from 'zod';

// Schémas Zod basés sur Prisma
export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  color: z.string(),
  unitPrice: z.number(),
  costPrice: z.number(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  minStock: z.number(),
  maxStock: z.number().optional(),
  organizationId: z.string(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  active: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types TypeScript
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type UpdateProductData = z.infer<typeof UpdateProductSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;