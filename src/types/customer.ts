export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: "INDIVIDUAL" | "COMPANY" | "VIP";
  organizationId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerType = Customer["type"];