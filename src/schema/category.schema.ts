import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  active: z.boolean(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type categoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type categoryUpdateInput = z.infer<typeof categoryUpdateSchema>;