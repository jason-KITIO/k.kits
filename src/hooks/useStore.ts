import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  storeService, 
  type Store, 
  type Product, 
  type Stock, 
  type StockMovement, 
  type Customer, 
  type Category, 
  type Supplier,
  type StoreDashboard 
} from '@/services/storeService';
import type { SaleCreateInput, StockAdjustmentInput } from '@/schema';

export const useStores = (organizationId: string) => {
  return useQuery<Store[]>({
    queryKey: ['organization', organizationId, 'stores'],
    queryFn: () => storeService.getStores(organizationId),
    enabled: !!organizationId,
  });
};

export const useStore = (organizationId: string, storeId: string) => {
  return useQuery<Store>({
    queryKey: ['organization', organizationId, 'stores', storeId],
    queryFn: () => storeService.getStore(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreDashboard = (organizationId: string, storeId: string) => {
  return useQuery<StoreDashboard>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'dashboard'],
    queryFn: () => storeService.getDashboard(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreProducts = (organizationId: string, storeId: string) => {
  return useQuery<Product[]>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'products'],
    queryFn: () => storeService.getProducts(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreProduct = (organizationId: string, storeId: string, productId: string) => {
  return useQuery<Product>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'products', productId],
    queryFn: () => storeService.getProduct(organizationId, storeId, productId),
    enabled: !!organizationId && !!storeId && !!productId,
  });
};

export const useProductByBarcode = (organizationId: string, storeId: string, code: string) => {
  return useQuery<Product>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'products', 'barcode', code],
    queryFn: () => storeService.searchProductByBarcode(organizationId, storeId, code),
    enabled: !!organizationId && !!storeId && !!code,
  });
};

export const useStoreStock = (organizationId: string, storeId: string) => {
  return useQuery<Stock[]>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'stock'],
    queryFn: () => storeService.getStock(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreStockMovements = (organizationId: string, storeId: string) => {
  return useQuery<StockMovement[]>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'stock-movements'],
    queryFn: () => storeService.getStockMovements(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useCreateStockAdjustment = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockAdjustmentInput) =>
      storeService.createStockAdjustment(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'stock'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'stock-movements'] 
      });
    },
  });
};

export const useStoreSales = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ['organization', organizationId, 'stores', storeId, 'sales'],
    queryFn: () => storeService.getSales(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useCreateSale = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SaleCreateInput) =>
      storeService.createSale(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'sales'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'stock'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'dashboard'] 
      });
    },
  });
};

export const useStoreSale = (organizationId: string, storeId: string, saleId: string) => {
  return useQuery({
    queryKey: ['organization', organizationId, 'stores', storeId, 'sales', saleId],
    queryFn: () => storeService.getSale(organizationId, storeId, saleId),
    enabled: !!organizationId && !!storeId && !!saleId,
  });
};

export const useStoreCustomers = (organizationId: string, storeId: string) => {
  return useQuery<Customer[]>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'customers'],
    queryFn: () => storeService.getCustomers(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreCategories = (organizationId: string, storeId: string) => {
  return useQuery<Category[]>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'categories'],
    queryFn: () => storeService.getCategories(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreSuppliers = (organizationId: string, storeId: string) => {
  return useQuery<Supplier[]>({
    queryKey: ['organization', organizationId, 'stores', storeId, 'suppliers'],
    queryFn: () => storeService.getSuppliers(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, data }: { organizationId: string; data: any }) =>
      storeService.createStore(organizationId, data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores'] 
      });
    },
  });
};

export const useCreateCustomer = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) =>
      storeService.createCustomer(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'customers'] 
      });
    },
  });
};

export const useCreateSupplier = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Supplier>) =>
      storeService.createSupplier(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'suppliers'] 
      });
    },
  });
};

export const useCreateProduct = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Product>) =>
      storeService.createProduct(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stores', storeId, 'products'] 
      });
    },
  });
};

// Export groupé pour faciliter l'utilisation
export const useStoreHooks = {
  useSuppliers: useStoreSuppliers,
  useCreateSupplier,
  useCreateProduct,
};