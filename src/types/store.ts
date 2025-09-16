import { z } from 'zod';

// Schémas Zod basés sur Prisma
export const StoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  managerId: z.string().optional(),
  type: z.enum(['PHYSICAL', 'ONLINE', 'HYBRID']),
  organizationId: z.string(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateStoreSchema = StoreSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateStoreSchema = CreateStoreSchema.partial();

export const StoreFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['PHYSICAL', 'ONLINE', 'HYBRID']).optional(),
  active: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types TypeScript
export type Store = z.infer<typeof StoreSchema>;
export type CreateStoreData = z.infer<typeof CreateStoreSchema>;
export type UpdateStoreData = z.infer<typeof UpdateStoreSchema>;
export type StoreFilters = z.infer<typeof StoreFiltersSchema>;