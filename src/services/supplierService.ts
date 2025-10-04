import { SupplierCreateInput } from "@/schema/supplier.schema";

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  taxNumber?: string;
  paymentTerms?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const supplierService = {
  async getAll(organizationId: string): Promise<Supplier[]> {
    const response = await fetch(`/api/organization/${organizationId}/suppliers`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    return response.json();
  },

  async create(organizationId: string, data: SupplierCreateInput): Promise<Supplier> {
    const response = await fetch(`/api/organization/${organizationId}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return response.json();
  },

  async update(organizationId: string, id: string, data: Partial<SupplierCreateInput>): Promise<Supplier> {
    const response = await fetch(`/api/organization/${organizationId}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour');
    return response.json();
  },

  async delete(organizationId: string, id: string): Promise<void> {
    const response = await fetch(`/api/organization/${organizationId}/suppliers/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  }
};