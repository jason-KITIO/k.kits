import { z } from "zod";

export const stockReturnCreateSchema = z.object({
  productId: z.string(),
  employeeId: z.string(),
  customerId: z.string().optional(),
  quantity: z.number().int().positive(),
  returnReason: z.string(),
  condition: z.enum(["GOOD", "DAMAGED", "DEFECTIVE"]),
  saleId: z.string().optional(),
  notes: z.string().optional(),
});

export const stockReturnUpdateSchema = z.object({
  status: z.enum(["RECEIVED", "INSPECTED", "RESTOCKED", "DAMAGED", "RETURNED_TO_WAREHOUSE"]).optional(),
  condition: z.enum(["GOOD", "DAMAGED", "DEFECTIVE"]).optional(),
  notes: z.string().optional(),
});

export const stockReturnProcessSchema = z.object({
  status: z.enum(["INSPECTED", "RESTOCKED", "DAMAGED", "RETURNED_TO_WAREHOUSE"]),
  condition: z.enum(["GOOD", "DAMAGED", "DEFECTIVE"]),
  notes: z.string().optional(),
  restockToEmployeeStock: z.boolean().default(true),
});

export type StockReturnCreateInput = z.infer<typeof stockReturnCreateSchema>;
export type StockReturnUpdateInput = z.infer<typeof stockReturnUpdateSchema>;
export type StockReturnProcessInput = z.infer<typeof stockReturnProcessSchema>;