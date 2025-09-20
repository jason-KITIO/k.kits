import { z } from "zod";

export const purchaseOrderCreateSchema = z.object({
  supplierId: z.string(),
  warehouseId: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "RECEIVED", "CANCELLED"]),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })),
  expectedDate: z.string().datetime().optional(),
});

export const purchaseOrderUpdateSchema = purchaseOrderCreateSchema.partial().omit({ items: true });

export const receiveOrderSchema = z.object({
  items: z.array(z.object({
    purchaseOrderItemId: z.string(),
    receivedQuantity: z.number().int().min(0),
  })),
});

export type PurchaseOrderCreateInput = z.infer<typeof purchaseOrderCreateSchema>;
export type PurchaseOrderUpdateInput = z.infer<typeof purchaseOrderUpdateSchema>;
export type ReceiveOrderInput = z.infer<typeof receiveOrderSchema>;