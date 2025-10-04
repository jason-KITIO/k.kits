import { z } from "zod";

export const userSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  display: z.object({
    darkMode: z.boolean(),
    language: z.enum(["fr", "en", "es"]),
    timezone: z.string(),
  }),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  profileImageUrl: z.string().url().optional().or(z.literal("")),
  settings: userSettingsSchema.optional(),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;