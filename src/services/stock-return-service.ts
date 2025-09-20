import { api } from './api';
import type { StockReturn, StockReturnWithRelations } from '@/types/stock-return';
import type { StockReturnCreateInput, StockReturnUpdateInput } from '@/schema/stock-return.schema';

export const stockReturnService = {
  // Lister les retours d'une boutique
  getByStore: (organizationId: string, storeId: string, params?: { status?: string; returnedById?: string }) =>
    api.get<StockReturnWithRelations[]>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-returns${
        params ? `?${new URLSearchParams(params).toString()}` : ''
      }`
    ),

  // Obtenir un retour spécifique
  getById: (organizationId: string, storeId: string, returnId: string) =>
    api.get<StockReturn>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-returns/${returnId}`
    ),

  // Créer un nouveau retour
  create: (organizationId: string, storeId: string, data: StockReturnCreateInput) =>
    api.post<StockReturn>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-returns`,
      data
    ),

  // Traiter un retour
  update: (organizationId: string, storeId: string, returnId: string, data: StockReturnUpdateInput) =>
    api.put<StockReturn>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-returns/${returnId}`,
      data
    ),

  // Supprimer un retour
  delete: (organizationId: string, storeId: string, returnId: string) =>
    api.delete(
      `/api/organization/${organizationId}/stores/${storeId}/stock-returns/${returnId}`
    ),
};