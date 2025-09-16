import type { Customer, CreateCustomerData, UpdateCustomerData, CustomerFilters } from '@/types/customer';

const getApiBase = (organizationId: string) => `/api/organization/${organizationId}/customers`;

export const customerService = {
  getCustomers: async (organizationId: string, filters: Partial<CustomerFilters> = {}): Promise<Customer[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.active !== undefined) params.append('active', filters.active.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${getApiBase(organizationId)}?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération des clients');
    }
    return response.json();
  },

  getCustomer: async (organizationId: string, id: string): Promise<Customer> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération du client');
    }
    return response.json();
  },

  createCustomer: async (organizationId: string, data: CreateCustomerData): Promise<Customer> => {
    const response = await fetch(getApiBase(organizationId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du client');
    }
    return response.json();
  },

  updateCustomer: async (organizationId: string, id: string, data: UpdateCustomerData): Promise<Customer> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la modification du client');
    }
    return response.json();
  },

  deleteCustomer: async (organizationId: string, id: string): Promise<void> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression du client');
    }
  },
};