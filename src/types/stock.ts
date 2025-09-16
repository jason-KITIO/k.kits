import { z } from 'zod';

// Schémas Zod basés sur Prisma
export const StockSchema = z.object({
  id: z.string(),
  productId: z.string(),
  warehouseId: z.string().optional(),
  storeId: z.string().optional(),
  quantity: z.number(),
  reservedQuantity: z.number(),
  organizationId: z.string(),
  lastUpdated: z.date(),
});

export const StockMovementSchema = z.object({
  id: z.string(),
  productId: z.string(),
  fromWarehouseId: z.string().optional(),
  toWarehouseId: z.string().optional(),
  fromStoreId: z.string().optional(),
  toStoreId: z.string().optional(),
  quantity: z.number(),
  type: z.enum(['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'SALE', 'PURCHASE']),
  reference: z.string().optional(),
  reason: z.string().optional(),
  userId: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
});

export const CreateStockAdjustmentSchema = z.object({
  productId: z.string(),
  storeId: z.string().optional(),
  warehouseId: z.string().optional(),
  quantity: z.number(),
  reason: z.string().optional(),
});

export const StockTransferSchema = z.object({
  productId: z.string(),
  fromStoreId: z.string().optional(),
  toStoreId: z.string().optional(),
  fromWarehouseId: z.string().optional(),
  toWarehouseId: z.string().optional(),
  quantity: z.number(),
  reason: z.string().optional(),
});

export const StockFiltersSchema = z.object({
  search: z.string().optional(),
  productId: z.string().optional(),
  storeId: z.string().optional(),
  warehouseId: z.string().optional(),
  lowStock: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types TypeScript
export type Stock = z.infer<typeof StockSchema>;
export type StockMovement = z.infer<typeof StockMovementSchema>;
export type CreateStockAdjustmentData = z.infer<typeof CreateStockAdjustmentSchema>;
export type StockTransferData = z.infer<typeof StockTransferSchema>;
export type StockFilters = z.infer<typeof StockFiltersSchema>;