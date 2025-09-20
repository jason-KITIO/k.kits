import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  profileImageUrl: z.string().url().nullable(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  banned: z.boolean(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  lastSignInAt: z.union([z.string(), z.date()]).nullable(),
  organizationMembers: z.array(z.object({
    id: z.string(),
    organizationId: z.string(),
    roleId: z.string(),
    active: z.boolean(),
    organization: z.object({
      id: z.string(),
      name: z.string(),
    }),
    role: z.object({
      id: z.string(),
      name: z.string(),
      permissions: z.array(z.string()),
    }),
  })).optional(),
});

export const meResponseSchema = z.object({
  user: userSchema,
});
