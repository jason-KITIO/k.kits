import { z } from 'zod';

export const StockMovementRequestSchema = z.object({
  id: z.string(),
  productId: z.string(),
  fromType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]),
  toType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]),
  fromId: z.string(),
  toId: z.string(),
  quantity: z.number(),
  status: z.enum(["PENDING", "APPROVED", "IN_TRANSIT", "COMPLETED", "REJECTED"]),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  requestedBy: z.string(),
  approvedBy: z.string().optional(),
  rejectedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  reason: z.string().optional(),
  reference: z.string().optional(),
  expiresAt: z.date().optional(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const StockMovementRequestWithRelationsSchema = StockMovementRequestSchema.extend({
  product: z.object({
    name: z.string(),
    sku: z.string(),
  }),
  requester: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
  }),
  approver: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
  }).optional(),
  rejecter: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
  }).optional(),
});

export const StockMovementRequestFiltersSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "IN_TRANSIT", "COMPLETED", "REJECTED"]).optional(),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  requestedBy: z.string().optional(),
  productId: z.string().optional(),
  fromType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]).optional(),
  toType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]).optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const StockMovementRequestApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export const StockMovementRequestCreateSchema = z.object({
  productId: z.string(),
  fromType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]),
  toType: z.enum(["WAREHOUSE", "EMPLOYEE_STOCK"]),
  fromId: z.string(),
  toId: z.string(),
  quantity: z.number(),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export type StockMovementRequest = z.infer<typeof StockMovementRequestSchema>;
export type StockMovementRequestWithRelations = z.infer<typeof StockMovementRequestWithRelationsSchema>;
export type StockMovementRequestFilters = z.infer<typeof StockMovementRequestFiltersSchema>;
export type StockMovementRequestApproval = z.infer<typeof StockMovementRequestApprovalSchema>;
export type StockMovementRequestCreate = z.infer<typeof StockMovementRequestCreateSchema>;