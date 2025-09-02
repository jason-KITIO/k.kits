import z from "zod";

export const stockCreateSchema = z.object({
  productId: z.string(),
  warehouseId: z.string().optional(),
  quantity: z.number().int().min(0),
  reservedQuantity: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const stockUpdateSchema = stockCreateSchema.partial();

export type stockCreateInput = z.infer<typeof stockCreateSchema>;
export type stockUpdateInput = z.infer<typeof stockUpdateSchema>;

export const stockWarehousesCreateSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(0),
  reservedQuantity: z.number().int().min(0).optional(),
  organizationId: z.string(),
});

export const stockWarehousesUpdateSchema =
  stockWarehousesCreateSchema.partial();

export type stockWarehousesCreateInput = z.infer<
  typeof stockWarehousesCreateSchema
>;
export type stockWarehousesUpdateInput = z.infer<
  typeof stockWarehousesUpdateSchema
>;
