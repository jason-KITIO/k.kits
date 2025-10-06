"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateRoleData } from "@/types/role";

interface RoleFormProps {
  formData: CreateRoleData;
  onChange: (data: CreateRoleData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isPending: boolean;
}

export function RoleForm({ formData, onChange, onSubmit, onCancel, isEditing, isPending }: RoleFormProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Modifier le rôle" : "Créer un rôle"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nom</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Couleur</label>
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => onChange({ ...formData, color: e.target.value })}
              className="w-12 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={formData.color}
              onChange={(e) => onChange({ ...formData, color: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Sauvegarde..." : isEditing ? "Modifier" : "Créer"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
