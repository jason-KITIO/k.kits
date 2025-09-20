import { z } from "zod";

export const storeCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  managerId: z.string().optional().nullable(),
  type: z.enum(["PHYSICAL", "ONLINE", "HYBRID"]).default("PHYSICAL"),
  active: z.boolean().optional().default(true),
});

export const storeUpdateSchema = storeCreateSchema.partial();

export type StoreCreateInput = z.infer<typeof storeCreateSchema>;
export type StoreUpdateInput = z.infer<typeof storeUpdateSchema>;
