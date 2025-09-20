import { z } from "zod";

export const stockMovementRequestCreateSchema = z.object({
  productId: z.string(),
  fromType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]),
  toType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]),
  fromId: z.string(),
  toId: z.string(),
  quantity: z.number().int().positive(),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  reason: z.string().optional(),
  reference: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const stockMovementRequestUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "IN_TRANSIT", "COMPLETED", "REJECTED"]).optional(),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export const stockMovementRequestApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
}).refine((data) => {
  if (data.status === "REJECTED" && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: "Le motif de refus est obligatoire lors du rejet",
  path: ["rejectionReason"],
});

export type StockMovementRequestCreateInput = z.infer<typeof stockMovementRequestCreateSchema>;
export type StockMovementRequestUpdateInput = z.infer<typeof stockMovementRequestUpdateSchema>;
export type StockMovementRequestApprovalInput = z.infer<typeof stockMovementRequestApprovalSchema>;