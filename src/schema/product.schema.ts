import { z } from "zod";

// Schéma Zod pour création produit
export const productCreateSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  color: z.string().min(1, "La couleur est requise"), // ajouté ici
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  unitPrice: z.number().positive(),
  costPrice: z.number().positive(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  minStock: z.number().int().nonnegative().optional(),
  maxStock: z.number().int().optional(),
  active: z.boolean().optional().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

export type productCreateInput = z.infer<typeof productCreateSchema>;
export type productUpdateInput = z.infer<typeof productUpdateSchema>;
