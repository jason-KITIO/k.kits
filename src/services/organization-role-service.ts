import type {
  RoleCreatePayload,
  OrganizationRolesResponse,
  CreateRoleResponse,
} from "@/types/organization-role";

export async function fetchOrganizationRoles(
  organizationId: string
): Promise<OrganizationRolesResponse> {
  const res = await fetch(
    `/api/organization/${organizationId}/roles?organizationId=${organizationId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.message || "Erreur lors de la récupération des rôles"
    );
  }

  return res.json();
}

export async function createOrganizationRole(
  organizationId: string,
  data: RoleCreatePayload
): Promise<CreateRoleResponse> {
  const res = await fetch(`/api/organization/${organizationId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erreur lors de la création du rôle");
  }

  return res.json();
}
