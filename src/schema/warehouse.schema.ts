import { z } from "zod";

export const warehouseCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().optional(),
  phone: z.string().optional(),
  managerId: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  type: z
    .enum(["MAIN", "SECONDARY", "TRANSIT", "RETURNS"])
    .optional()
    .default("MAIN"),
  active: z.boolean().optional().default(true),
});

export const warehouseUpdateSchema = warehouseCreateSchema.partial();

export type WarehouseCreateInput = z.infer<typeof warehouseCreateSchema>;
export type WarehouseUpdateInput = z.infer<typeof warehouseUpdateSchema>;
