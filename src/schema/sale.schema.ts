import { z } from "zod";

export const saleCreateSchema = z.object({
  customerId: z.string().optional(),
  storeId: z.string(),
  totalAmount: z.number().positive(),
  paidAmount: z.number().min(0).default(0),
  status: z.enum(["PENDING", "PAID", "PARTIAL", "CANCELLED", "REFUNDED"]).default("PENDING"),
  dueDate: z.string().datetime().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    discount: z.number().min(0).max(100).default(0),
  })),
});

export const saleUpdateSchema = saleCreateSchema.partial().omit({ items: true });

export type SaleCreateInput = z.infer<typeof saleCreateSchema>;
export type SaleUpdateInput = z.infer<typeof saleUpdateSchema>;