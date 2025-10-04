import { z } from "zod";

export const organizationCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
  logo: z.string().optional().nullable().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Le logo doit être une URL valide"
  }),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "L'email doit être valide"
  }),
  active: z.boolean().optional(),
});

// Validation du corps pour la mise à jour de l'organisation
export const organizationUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(255).nullable().optional(),
  domain: z.string().max(100).nullable().optional(),
  logo: z.string().nullable().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Le logo doit être une URL valide"
  }),
  address: z.string().max(255).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().nullable().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "L'email doit être valide"
  }),
  active: z.boolean().optional(),
});
