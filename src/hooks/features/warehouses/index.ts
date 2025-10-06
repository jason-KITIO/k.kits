export { useWarehouseList, useWarehouseDetail } from './useWarehouseList';
export { useWarehouseStock, useWarehouseStockMovements } from './useWarehouseStock';
export { useWarehousePurchaseOrders, useWarehouseStockMovementRequests } from './useWarehousePurchaseOrders';
export { useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from './useWarehouseMutations';
export { useCreatePurchaseOrder, useCreateStockAdjustment, useCreateStockTransfer } from './useStockOperations';
export { useSuppliers, useProducts } from './useSuppliers';

// Backward compatibility exports
export { useWarehouseList as useWarehouses } from './useWarehouseList';
export { useWarehouseDetail as useWarehouse } from './useWarehouseList';
