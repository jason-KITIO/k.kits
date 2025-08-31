export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  organizationId: string;
  status: "DRAFT" | "SENT" | "CONFIRMED" | "RECEIVED" | "CANCELLED";
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  totalAmount: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  receivedBy?: string;
  createdAt: string;
  updatedAt: string;
  supplier?: {
    id: string;
    name: string;
    email?: string;
  };
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQty: number;
  notes?: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  taxNumber?: string;
  paymentTerms?: string;
  notes?: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderData {
  supplierId: string;
  expectedDate?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  taxNumber?: string;
  paymentTerms?: string;
  notes?: string;
}
