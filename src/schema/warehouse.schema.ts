import { z } from "zod";

export const warehouseCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["MAIN", "SECONDARY", "TRANSIT", "RETURNS"]),
  active: z.boolean(),
  address: z.string().optional(),
  phone: z.string().optional(),
  managerId: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

export const warehouseUpdateSchema = warehouseCreateSchema.partial();

export const stockAdjustmentSchema = z.object({
  productId: z.string(),
  quantity: z.number().int(),
  reason: z.string(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  reference: z.string().optional(),
});

export const warehouseCapacityCheckSchema = z.object({
  warehouseId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const warehouseDeletionSchema = z.object({
  transferToWarehouseId: z.string().optional(),
  forceDelete: z.boolean().default(false),
}).refine((data) => {
  if (!data.forceDelete && !data.transferToWarehouseId) {
    return false;
  }
  return true;
}, {
  message: "Vous devez spécifier un entrepôt de destination ou forcer la suppression",
  path: ["transferToWarehouseId"],
});

export type WarehouseCreateInput = z.infer<typeof warehouseCreateSchema>;
export type WarehouseUpdateInput = z.infer<typeof warehouseUpdateSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
export type WarehouseCapacityCheckInput = z.infer<typeof warehouseCapacityCheckSchema>;
export type WarehouseDeletionInput = z.infer<typeof warehouseDeletionSchema>;