import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  profileImageUrl: z.string().url().nullable(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  banned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastSignInAt: z.string().nullable(),
});

export const meResponseSchema = z.object({
  user: userSchema,
});
