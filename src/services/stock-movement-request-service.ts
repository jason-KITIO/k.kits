import { api } from './api';
import type { 
  StockMovementRequestWithRelations, 
  StockMovementRequestCreate, 
  StockMovementRequestApproval 
} from '@/types/stock-movement-request';

export const stockMovementRequestService = {
  // Lister les demandes de mouvement d'une boutique
  getByStore: (organizationId: string, storeId: string, params?: { status?: string; requesterId?: string }) =>
    api.get<StockMovementRequestWithRelations[]>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests${
        params ? `?${new URLSearchParams(params).toString()}` : ''
      }`
    ),

  // Obtenir une demande spécifique
  getById: (organizationId: string, storeId: string, requestId: string) =>
    api.get<StockMovementRequestWithRelations>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests/${requestId}`
    ),

  // Créer une nouvelle demande
  create: (organizationId: string, storeId: string, data: StockMovementRequestCreate) =>
    api.post<StockMovementRequestWithRelations>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests`,
      data
    ),

  // Approuver/rejeter une demande
  approve: (organizationId: string, storeId: string, requestId: string, data: StockMovementRequestApproval) =>
    api.put<StockMovementRequestWithRelations>(
      `/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests/${requestId}`,
      data
    ),
};