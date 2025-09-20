import { api } from './api';
import type { EmployeeStock } from '@/types/employee-stock';
import type { EmployeeStockCreateInput, EmployeeStockUpdateInput } from '@/schema/employee-stock.schema';

export const employeeStockService = {
  // Lister les stocks employés d'une boutique
  getByStore: (organizationId: string, storeId: string, employeeId?: string) =>
    api.get<EmployeeStock[]>(
      `/api/organization/${organizationId}/stores/${storeId}/employee-stocks${
        employeeId ? `?employeeId=${employeeId}` : ''
      }`
    ),

  // Obtenir un stock employé spécifique
  getById: (organizationId: string, storeId: string, employeeStockId: string) =>
    api.get<EmployeeStock>(
      `/api/organization/${organizationId}/stores/${storeId}/employee-stocks/${employeeStockId}`
    ),

  // Créer un nouveau stock employé
  create: (organizationId: string, storeId: string, data: EmployeeStockCreateInput) =>
    api.post<EmployeeStock>(
      `/api/organization/${organizationId}/stores/${storeId}/employee-stocks`,
      data
    ),

  // Mettre à jour un stock employé
  update: (organizationId: string, storeId: string, employeeStockId: string, data: EmployeeStockUpdateInput) =>
    api.put<EmployeeStock>(
      `/api/organization/${organizationId}/stores/${storeId}/employee-stocks/${employeeStockId}`,
      data
    ),

  // Supprimer un stock employé
  delete: (organizationId: string, storeId: string, employeeStockId: string) =>
    api.delete(
      `/api/organization/${organizationId}/stores/${storeId}/employee-stocks/${employeeStockId}`
    ),
};