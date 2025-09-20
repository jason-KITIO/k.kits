// Export all schemas and types
export * from './sale.schema';
export {
  stockMovementCreateSchema,
  stockAdjustmentSchema as stockMovementAdjustmentSchema
} from './stock-movement.schema';
export type {
  StockMovementCreateInput,
  StockAdjustmentInput as StockMovementAdjustmentInput
} from './stock-movement.schema';
export * from './stock-transfer.schema';
export * from './purchase-order.schema';
export * from './notification.schema';
export * from './product.schema';
export * from './customer.schema';
export * from './category.schema';
export * from './supplier.schema';
export * from './stock.schema';
export * from './store-schema';
export * from './warehouse.schema';
export * from './organization-schema';
export * from './role-schema';
export * from './user-schema';
export * from './invitation-schema';
export * from './auth-schema';
export * from './phone-auth';

// New schemas for employee stock system
export * from './employee-stock.schema';
export * from './stock-movement-request.schema';
export * from './stock-return.schema';