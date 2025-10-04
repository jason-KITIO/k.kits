import { useOptimizedQuery } from './use-optimized-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Warehouse = {
  id: string;
  name: string;
  type: "MAIN" | "SECONDARY" | "TRANSIT" | "RETURNS";
  address?: string;
  phone?: string;
  capacity?: number;
  active: boolean;
  managerId?: string;
  manager?: {
    firstName: string;
    lastName: string;
  };
};

type StockItem = {
  id: string;
  quantity: number;
  reservedQuantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  };
};

type StockMovement = {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  reference?: string;
  product: {
    name: string;
    sku: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
};

type PurchaseOrder = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderNumber: string;
  expectedDate?: string;
  supplier: {
    name: string;
  };
};

type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  category?: {
    name: string;
  };
};

type StockMovementRequest = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  quantity: number;
  reason?: string;
  createdAt: string;
  fromType: string;
  toType: string;
  fromId: string;
  toId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

type PurchaseOrderCreateData = {
  supplierId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
};

type StockAdjustmentData = {
  productId: string;
  quantity: number;
  reason: string;
  notes?: string;
};

type StockTransferData = {
  fromWarehouseId: string;
  toWarehouseId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  reason?: string;
};

export const useWarehouses = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouses', organizationId],
    queryFn: async (): Promise<Warehouse[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des entrepôts');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};

export const useWarehouse = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse', organizationId, warehouseId],
    queryFn: async (): Promise<Warehouse> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'entrepôt');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useWarehouseStock = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-stock', organizationId, warehouseId],
    queryFn: async (): Promise<StockItem[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du stock');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useWarehouseStockMovements = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-stock-movements', organizationId, warehouseId],
    queryFn: async (): Promise<StockMovement[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-movements`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des mouvements');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useWarehousePurchaseOrders = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-purchase-orders', organizationId, warehouseId],
    queryFn: async (): Promise<PurchaseOrder[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useWarehouseStockMovementRequests = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-stock-movement-requests', organizationId, warehouseId],
    queryFn: async (): Promise<StockMovementRequest[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-movement-requests`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des requêtes');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useCreateWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Warehouse, 'id'>) => {
      const transformedData = {
        ...data,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };
      const response = await fetch(`/api/organization/${organizationId}/warehouses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(transformedData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'entrepôt');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      toast.success('Succès', {
        description: 'Entrepôt créé avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useCreatePurchaseOrder = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PurchaseOrderCreateData) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-purchase-orders', organizationId, warehouseId] });
      toast.success('Succès', {
        description: 'Commande créée avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useUpdateWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ warehouseId, data }: { warehouseId: string; data: Partial<Omit<Warehouse, 'id'>> }) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la modification de l\'entrepôt');
      }
      return response.json();
    },
    onSuccess: (_, { warehouseId }) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', organizationId, warehouseId] });
      toast.success('Succès', {
        description: 'Entrepôt modifié avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useCreateStockAdjustment = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockAdjustmentData) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-adjustments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajustement du stock');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock', organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock-movements', organizationId, warehouseId] });
      toast.success('Succès', {
        description: 'Ajustement de stock effectué avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useCreateStockTransfer = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockTransferData) => {
      const response = await fetch(`/api/organization/${organizationId}/stock-transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors du transfert de stock');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock-movements', organizationId] });
      toast.success('Succès', {
        description: 'Transfert de stock effectué avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useSuppliers = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['suppliers', organizationId],
    queryFn: async (): Promise<Supplier[]> => {
      const response = await fetch(`/api/organization/${organizationId}/suppliers`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fournisseurs');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};

export const useProducts = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['products', organizationId],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch(`/api/organization/${organizationId}/products`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};

export const useDeleteWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ warehouseId, transferToWarehouseId, forceDelete }: { 
      warehouseId: string; 
      transferToWarehouseId?: string; 
      forceDelete?: boolean; 
    }) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ transferToWarehouseId, forceDelete }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          // Retourner les options pour gérer dans l'UI
          throw { status: 409, data: errorData };
        }
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'entrepôt');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      toast.success('Succès', {
        description: 'Entrepôt supprimé avec succès',
        duration: 5000,
      });
    },
    onError: (error: any) => {
      if (error.status !== 409) {
        toast.error('Erreur', {
          description: error.message,
          duration: 5000,
        });
      }
    },
  });
};