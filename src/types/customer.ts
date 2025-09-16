import { z } from 'zod';

// Schémas Zod basés sur Prisma
export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(['INDIVIDUAL', 'COMPANY', 'VIP']),
  organizationId: z.string(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const CustomerFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['INDIVIDUAL', 'COMPANY', 'VIP']).optional(),
  active: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types TypeScript
export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomerData = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerData = z.infer<typeof UpdateCustomerSchema>;
export type CustomerFilters = z.infer<typeof CustomerFiltersSchema>;