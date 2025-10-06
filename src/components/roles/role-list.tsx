"use client";

import { useState } from "react";
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/use-roles";
import { CreateRoleData, UpdateRoleData, Role } from "@/types/role";
import { RoleForm } from "./role/RoleForm";
import { RoleCard } from "./role/RoleCard";
import { RoleListLoading } from "./role/RoleListLoading";

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

  const handleDuplicate = (role: Role) => {
    setFormData({
      name: `${role.name} (Copie)`,
      description: role.description || "",
      color: role.color || "#3b82f6",
    });
    setEditingRole(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", color: "#3b82f6" });
    setEditingRole(null);
    setShowForm(false);
  };

  if (isLoading) return <RoleListLoading />;

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
        <RoleForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingRole}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rôles disponibles</h3>
          {(roles as any)?.length === 0 ? (
            <p className="text-muted-foreground">Aucun rôle créé</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(roles as any)?.map((role: Role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
