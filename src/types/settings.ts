export interface OrganizationSettings {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  lowStockThreshold: number;
  autoReorderEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  lastLogin?: string;
  createdAt: string;
  organizationId: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  organizationId: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
  currency?: string;
  language?: string;
  dateFormat?: string;
  lowStockThreshold?: number;
  autoReorderEnabled?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface CreateUserData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[];
}
