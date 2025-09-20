import { z } from "zod";

export const supplierCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  active: z.boolean(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  taxNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

export type SupplierCreateInput = z.infer<typeof supplierCreateSchema>;