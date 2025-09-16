import { z } from 'zod';

// Schémas Zod basés sur Prisma
export const SaleSchema = z.object({
  id: z.string(),
  totalAmount: z.number(),
  discountAmount: z.number().optional(),
  taxAmount: z.number().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'MOBILE']),
  customerId: z.string().optional(),
  storeId: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSaleSchema = SaleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSaleSchema = CreateSaleSchema.partial();

export const SaleFiltersSchema = z.object({
  search: z.string().optional(),
  storeId: z.string().optional(),
  customerId: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'MOBILE']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types TypeScript
export type Sale = z.infer<typeof SaleSchema>;
export type CreateSaleData = z.infer<typeof CreateSaleSchema>;
export type UpdateSaleData = z.infer<typeof UpdateSaleSchema>;
export type SaleFilters = z.infer<typeof SaleFiltersSchema>;