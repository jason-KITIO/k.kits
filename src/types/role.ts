export interface Role {
  id: string;
  name: string;
  description?: string;
  color?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  color?: string;
  active?: boolean;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  color?: string;
  active?: boolean;
}