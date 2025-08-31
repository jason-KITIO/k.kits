import {
  OrganizationSettings,
  User,
  Role,
  Permission,
  UpdateOrganizationData,
  CreateUserData,
  CreateRoleData,
} from "@/types/settings";

// Organization Settings
export async function fetchOrganizationSettings(
  organizationId: string
): Promise<OrganizationSettings> {
  const response = await fetch(`/api/organization/${organizationId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Erreur lors du chargement des paramètres");
  return response.json();
}

export async function updateOrganizationSettings(
  organizationId: string,
  data: UpdateOrganizationData
): Promise<OrganizationSettings> {
  const response = await fetch(`/api/organization/${organizationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erreur lors de la mise à jour");
  return response.json();
}

// Users
export async function fetchUsers(organizationId: string): Promise<User[]> {
  const response = await fetch(`/api/organization/${organizationId}/users`, {
    credentials: "include",
  });
  if (!response.ok)
    throw new Error("Erreur lors du chargement des utilisateurs");
  return response.json();
}

export async function createUser(
  organizationId: string,
  data: CreateUserData
): Promise<User> {
  const response = await fetch(`/api/organization/${organizationId}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la création de l'utilisateur");
  return response.json();
}

export async function updateUser(
  organizationId: string,
  userId: string,
  data: Partial<CreateUserData>
): Promise<User> {
  const response = await fetch(
    `/api/organization/${organizationId}/users/${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de l'utilisateur");
  return response.json();
}

export async function deleteUser(
  organizationId: string,
  userId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/users/${userId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de l'utilisateur");
}

// Roles
export async function fetchRoles(organizationId: string): Promise<Role[]> {
  const response = await fetch(`/api/organization/${organizationId}/roles`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Erreur lors du chargement des rôles");
  return response.json();
}

export async function createRole(
  organizationId: string,
  data: CreateRoleData
): Promise<Role> {
  const response = await fetch(`/api/organization/${organizationId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erreur lors de la création du rôle");
  return response.json();
}

export async function updateRole(
  organizationId: string,
  roleId: string,
  data: Partial<CreateRoleData>
): Promise<Role> {
  const response = await fetch(
    `/api/organization/${organizationId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la mise à jour du rôle");
  return response.json();
}

export async function deleteRole(
  organizationId: string,
  roleId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/roles/${roleId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la suppression du rôle");
}

// Permissions
export async function fetchPermissions(): Promise<Permission[]> {
  const response = await fetch("/api/permissions", {
    credentials: "include",
  });
  if (!response.ok)
    throw new Error("Erreur lors du chargement des permissions");
  return response.json();
}
