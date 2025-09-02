"use client";

import { useState } from "react";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/use-roles";
import { CreateRoleData, UpdateRoleData, Role } from "@/types/role";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface RoleListProps {
  organizationId: string;
}

export function RoleList({ organizationId }: RoleListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<CreateRoleData>({
    name: "",
    description: "",
    color: "#3b82f6",
  });

  const { data: roles, isLoading } = useRoles(organizationId);
  const createMutation = useCreateRole(organizationId);
  const updateMutation = useUpdateRole(organizationId);
  const deleteMutation = useDeleteRole(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateMutation.mutateAsync({
          roleId: editingRole.id,
          data: formData as UpdateRoleData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Erreur sauvegarde rôle:", error);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
      color: role.color || "#3b82f6",
    });
    setShowForm(true);
  };

  const handleDelete = async (roleId: string) => {
    if (confirm("Supprimer ce rôle ?")) {
      await deleteMutation.mutateAsync(roleId);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", color: "#3b82f6" });
    setEditingRole(null);
    setShowForm(false);
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rôles</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Nouveau rôle
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {editingRole ? "Modifier le rôle" : "Créer un rôle"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Couleur</label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-12 h-10 border rounded-md cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Sauvegarde..."
                  : editingRole
                  ? "Modifier"
                  : "Créer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rôles disponibles</h3>
          {roles?.length === 0 ? (
            <p className="text-muted-foreground">Aucun rôle créé</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles?.map((role) => (
                <div key={role.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <h4 className="font-medium">{role.name}</h4>
                  </div>
                  {role.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {role.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-primary hover:text-primary/90 text-sm px-2 py-1"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      disabled={deleteMutation.isPending}
                      className="text-destructive hover:text-destructive/90 text-sm px-2 py-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
