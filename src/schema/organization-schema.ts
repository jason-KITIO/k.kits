import { z } from "zod";

export const organizationCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().nullable(),
  domain: z
    .string()
    // Le sous-domaine doit respecter un pattern simple type a-z 0-9 - (sans point)
    .regex(
      /^[a-z0-9-]+$/,
      "Nom de sous-domaine invalide. Sans espaces ni majuscules."
    )
    .optional()
    .nullable(),
  logo: z.string().url().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  active: z.boolean().optional(),
});
