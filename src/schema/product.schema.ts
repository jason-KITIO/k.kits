import { z } from "zod";

// Schéma Zod pour création produit
export const productCreateSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  unitPrice: z.number().positive(),
  costPrice: z.number().positive(),
  weight: z.number().nonnegative().optional(),
  dimensions: z.string().optional(),
  initialStock: z.number().int().nonnegative().optional(),
  warehouseId: z.string().optional(),
  active: z.boolean().optional().default(true),
});

// Schéma Zod pour édition produit (inclut minStock)
export const productEditSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  unitPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  weight: z.number().nonnegative().optional(),
  dimensions: z.string().optional(),
  minStock: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export const productUpdateSchema = productEditSchema;

export type productCreateInput = z.infer<typeof productCreateSchema>;
export type productEditInput = z.infer<typeof productEditSchema>;
export type productUpdateInput = z.infer<typeof productUpdateSchema>;
