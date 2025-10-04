import { z } from "zod";

export const stockMovementRequestCreateSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  reason: z.string().optional(),
});

export const stockMovementRequestUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "IN_TRANSIT", "COMPLETED", "REJECTED"]).optional(),
  rejectionReason: z.string().optional(),
});

export const stockMovementRequestApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approverId: z.string(),
  rejectionReason: z.string().optional(),
});

export type StockMovementRequestCreateInput = z.infer<typeof stockMovementRequestCreateSchema>;
export type StockMovementRequestUpdateInput = z.infer<typeof stockMovementRequestUpdateSchema>;
export type StockMovementRequestApprovalInput = z.infer<typeof stockMovementRequestApprovalSchema>;