import { z } from "zod";

export const organizationSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    stockAlerts: z.boolean(),
    weeklyReports: z.boolean(),
  }),
});

export const organizationSettingsUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  domain: z.string().optional(),
  settings: organizationSettingsSchema.optional(),
});

export type OrganizationSettings = z.infer<typeof organizationSettingsSchema>;
export type OrganizationSettingsUpdate = z.infer<typeof organizationSettingsUpdateSchema>;