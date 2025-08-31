export interface Warehouse {
  id: string;
  name: string;
  description?: string;
  address?: string;
  managerId?: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  stocks?: WarehouseStock[];
  locations?: StockLocation[];
}

export interface WarehouseStock {
  id: string;
  productId: string;
  warehouseId: string;
  locationId?: string;
  quantity: number;
  reservedQty: number;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
  location?: StockLocation;
}

export interface StockLocation {
  id: string;
  name: string;
  description?: string;
  warehouseId: string;
  zone?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
  active: boolean;
  warehouse?: Warehouse;
}

export interface CreateWarehouseData {
  name: string;
  description?: string;
  address?: string;
  managerId?: string;
}

export interface UpdateWarehouseData extends Partial<CreateWarehouseData> {
  active?: boolean;
}

export interface CreateLocationData {
  name: string;
  description?: string;
  zone?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
}

export interface UpdateLocationData extends Partial<CreateLocationData> {
  active?: boolean;
}
