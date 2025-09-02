import { z } from "zod";

export const supplierCreateSchema = z.object({
  name: z.string().min(1, "Le nom du fournisseur est requis"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  taxNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export const supplierUpdateSchema = supplierCreateSchema.partial();

export type SupplierCreateInput = z.infer<typeof supplierCreateSchema>;
export type SupplierUpdateInput = z.infer<typeof supplierUpdateSchema>;
