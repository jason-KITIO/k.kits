import { z } from 'zod';

export const StockReturnSchema = z.object({
  id: z.string(),
  productId: z.string(),
  employeeId: z.string(),
  customerId: z.string().optional(),
  quantity: z.number(),
  returnReason: z.string(),
  status: z.enum(["RECEIVED", "INSPECTED", "RESTOCKED", "DAMAGED", "RETURNED_TO_WAREHOUSE"]),
  condition: z.enum(["GOOD", "DAMAGED", "DEFECTIVE"]),
  saleId: z.string().optional(),
  notes: z.string().optional(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const StockReturnWithRelationsSchema = StockReturnSchema.extend({
  product: z.object({
    name: z.string(),
    sku: z.string(),
    unitPrice: z.number(),
  }),
  employee: z.object({
    id: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
  }),
  customer: z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  sale: z.object({
    id: z.string(),
    totalAmount: z.number(),
    saleDate: z.date(),
  }).optional(),
});

export const StockReturnFiltersSchema = z.object({
  status: z.enum(["RECEIVED", "INSPECTED", "RESTOCKED", "DAMAGED", "RETURNED_TO_WAREHOUSE"]).optional(),
  condition: z.enum(["GOOD", "DAMAGED", "DEFECTIVE"]).optional(),
  employeeId: z.string().optional(),
  customerId: z.string().optional(),
  productId: z.string().optional(),
  returnReason: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type StockReturn = z.infer<typeof StockReturnSchema>;
export type StockReturnWithRelations = z.infer<typeof StockReturnWithRelationsSchema>;
export type StockReturnFilters = z.infer<typeof StockReturnFiltersSchema>;