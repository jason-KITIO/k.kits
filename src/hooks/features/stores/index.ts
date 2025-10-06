export { useStoreList, useStoreDetail, useStoreDashboard } from './useStoreList';
export { useStoreProducts, useStoreProduct, useProductByBarcode } from './useStoreProducts';
export { useStoreStock, useStoreStockMovements, useCreateStockAdjustment as useCreateStoreStockAdjustment } from './useStoreStock';
export { useStoreSales, useStoreSale, useCreateSale } from './useStoreSales';
export { useStoreCustomers, useStoreCustomer, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from './useStoreCustomers';
export { useCreateStore, useUpdateStore, useDeleteStore, useCreateSupplier, useCreateProduct } from './useStoreMutations';
export { useStoreCategories, useStoreSuppliers } from './useStoreData';
export { useStoresWithFilters, useStoreById, useStoreStockById } from './useStoreFilters';
export { useWarehouseToStoreTransfer } from './useStoreTransfers';

// Backward compatibility exports
export { useStoreList as useStores } from './useStoreList';
export { useStoreDetail as useStore } from './useStoreList';
