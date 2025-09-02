import { z } from "zod";

export const stockTransferCreateSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  fromWarehouseId: z.string().optional(),
  toWarehouseId: z.string().optional(),
  fromStoreId: z.string().optional(),
  toStoreId: z.string().optional(),
  reason: z.string().optional(),
}).refine(
  (data) => {
    const hasFrom = data.fromWarehouseId || data.fromStoreId;
    const hasTo = data.toWarehouseId || data.toStoreId;
    return hasFrom && hasTo;
  },
  { message: "Source et destination requises" }
);

export const stockTransferUpdateSchema = z.object({
  status: z.enum(["PENDING", "IN_TRANSIT", "COMPLETED", "CANCELLED"]),
});

export type StockTransferCreateInput = z.infer<typeof stockTransferCreateSchema>;
export type StockTransferUpdateInput = z.infer<typeof stockTransferUpdateSchema>;