import { z } from 'zod';

export const EmployeeStockSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  productId: z.string(),
  storeId: z.string(),
  quantity: z.number(),
  reservedQuantity: z.number(),
  capacity: z.number(),
  organizationId: z.string(),
  lastUpdated: z.date(),
  createdAt: z.date(),
});

export const EmployeeStockWithRelationsSchema = EmployeeStockSchema.extend({
  employee: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
  }),
  product: z.object({
    name: z.string(),
    sku: z.string(),
    unitPrice: z.number(),
    minStock: z.number(),
  }),
  store: z.object({
    name: z.string(),
  }),
});

export const EmployeeStockFiltersSchema = z.object({
  employeeId: z.string().optional(),
  productId: z.string().optional(),
  storeId: z.string().optional(),
  lowStock: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type EmployeeStock = z.infer<typeof EmployeeStockSchema>;
export type EmployeeStockWithRelations = z.infer<typeof EmployeeStockWithRelationsSchema>;
export type EmployeeStockFilters = z.infer<typeof EmployeeStockFiltersSchema>;