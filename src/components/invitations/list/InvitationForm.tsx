"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateInvitationData } from "@/types/invitation";

interface InvitationFormProps {
  formData: CreateInvitationData;
  roles: any[];
  onChange: (data: CreateInvitationData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function InvitationForm({ formData, roles, onChange, onSubmit, onCancel, isPending }: InvitationFormProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Inviter un utilisateur</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Rôle</label>
          <Select value={formData.roleId} onValueChange={(value) => onChange({ ...formData, roleId: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner le rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sélectionner un rôle</SelectLabel>
                {roles?.map((role: any) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Envoi..." : "Envoyer invitation"}
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
