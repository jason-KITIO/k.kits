import type { Role } from "@prisma/client";

export interface RoleCreatePayload {
  name: string;
  description?: string;
  color?: string;
}

export interface OrganizationRolesResponse {
  roles: Role[];
}

export interface CreateRoleResponse {
  message: string;
  role: Role;
}
