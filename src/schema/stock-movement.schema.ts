import { z } from "zod";

export const stockMovementCreateSchema = z.object({
  productId: z.string(),
  quantity: z.number().int(),
  type: z.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT"]),
  fromWarehouseId: z.string().optional(),
  toWarehouseId: z.string().optional(),
  fromStoreId: z.string().optional(),
  toStoreId: z.string().optional(),
  reference: z.string().optional(),
  reason: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string(),
  quantity: z.number().int(),
  reason: z.string(),
});

export type StockMovementCreateInput = z.infer<typeof stockMovementCreateSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;