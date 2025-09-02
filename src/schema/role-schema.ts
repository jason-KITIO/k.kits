import { z } from "zod";

export const roleCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
});

export const roleUpdateSchema = roleCreateSchema.partial();
