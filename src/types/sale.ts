export interface SaleItem {
  quantity: number;
}

export interface SaleCustomer {
  name: string;
}

export interface Sale {
  id: string;
  totalAmount: number;
  paidAmount: number;
  status: "PENDING" | "PAID" | "PARTIAL" | "CANCELLED" | "REFUNDED";
  saleDate: string;
  customer?: SaleCustomer;
  items?: SaleItem[];
}

export type SaleStatus = Sale["status"];