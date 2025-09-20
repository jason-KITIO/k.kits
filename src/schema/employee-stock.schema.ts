import { z } from "zod";

export const employeeStockCreateSchema = z.object({
  employeeId: z.string(),
  productId: z.string(),
  storeId: z.string(),
  capacity: z.number().int().positive(),
});

export const employeeStockUpdateSchema = z.object({
  quantity: z.number().int().min(0).optional(),
  capacity: z.number().int().positive().optional(),
});

export const employeeStockAdjustmentSchema = z.object({
  productId: z.string(),
  employeeId: z.string(),
  quantity: z.number().int(),
  reason: z.string(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
});

export type EmployeeStockCreateInput = z.infer<typeof employeeStockCreateSchema>;
export type EmployeeStockUpdateInput = z.infer<typeof employeeStockUpdateSchema>;
export type EmployeeStockAdjustmentInput = z.infer<typeof employeeStockAdjustmentSchema>;