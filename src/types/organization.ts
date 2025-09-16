import { z } from 'zod';

// Schémas Zod basés sur Prisma
export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  domain: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateOrganizationSchema = OrganizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export const OrganizationFiltersSchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types TypeScript
export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganizationData = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof UpdateOrganizationSchema>;
export type OrganizationFilters = z.infer<typeof OrganizationFiltersSchema>;