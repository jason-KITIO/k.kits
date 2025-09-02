import z from "zod";

// Schéma Zod pour création client
export const customerCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z
    .enum(["INDIVIDUAL", "COMPANY", "VIP"])
    .optional()
    .default("INDIVIDUAL"),
  active: z.boolean().optional().default(true),
});

export const customerUpdateSchema = customerCreateSchema.partial();

export type customerCreateInput = z.infer<typeof customerCreateSchema>;
export type customerUpdateInput = z.infer<typeof customerUpdateSchema>;
