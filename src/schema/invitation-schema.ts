import { z } from "zod";

export const invitationCreateSchema = z.object({
  email: z.string().email("Email invalide"),
  roleId: z.string().min(1, "Rôle requis"),
  storeId: z.string().optional().nullable(),
});

export const invitationUpdateSchema = z.object({
  roleId: z.string().optional(),
  storeId: z.string().optional().nullable(),
  expiresAt: z.string().datetime().optional(),
});