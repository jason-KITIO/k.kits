import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Le nom de la catégorie est requis"),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
  active: z.boolean().optional().default(true),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
