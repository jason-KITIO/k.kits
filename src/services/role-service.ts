import { Role, CreateRoleData, UpdateRoleData } from "@/types/role";

const API_BASE = "/api";

export const roleService = {
  // Lister les rôles d'une organisation
  async getRoles(organizationId: string): Promise<Role[]> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/roles`);
    if (!response.ok) throw new Error("Erreur lors du chargement des rôles");
    return response.json();
  },

  // Créer un nouveau rôle
  async createRole(organizationId: string, data: CreateRoleData): Promise<Role> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la création du rôle");
    return response.json();
  },

  // Récupérer un rôle spécifique
  async getRole(organizationId: string, roleId: string): Promise<Role> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/roles/${roleId}`);
    if (!response.ok) throw new Error("Erreur lors du chargement du rôle");
    return response.json();
  },

  // Modifier un rôle
  async updateRole(organizationId: string, roleId: string, data: UpdateRoleData): Promise<Role> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/roles/${roleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la modification du rôle");
    return response.json();
  },

  // Supprimer un rôle
  async deleteRole(organizationId: string, roleId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/roles/${roleId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression du rôle");
  },
};