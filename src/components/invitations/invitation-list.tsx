"use client";

import { useState } from "react";
import {
  useInvitations,
  useCreateInvitation,
  useCancelInvitation,
} from "@/hooks/use-invitations";
import { useRoles } from "@/hooks/use-roles";
import { CreateInvitationData } from "@/types/invitation";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface InvitationListProps {
  organizationId: string;
}

export function InvitationList({ organizationId }: InvitationListProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateInvitationData>({
    email: "",
    roleId: "",
  });

  const { data: invitations, isLoading } = useInvitations(organizationId);
  const { data: roles } = useRoles(organizationId);
  const createMutation = useCreateInvitation(organizationId);
  const cancelMutation = useCancelInvitation(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData({ email: "", roleId: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur création invitation:", error);
    }
  };

  const handleCancel = async (invitationId: string) => {
    if (confirm("Annuler cette invitation ?")) {
      await cancelMutation.mutateAsync(invitationId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "hsl(var(--warning))";
      case "ACCEPTED":
        return "hsl(var(--success))";
      case "EXPIRED":
        return "hsl(var(--muted))";
      case "CANCELLED":
        return "hsl(var(--destructive))";
      default:
        return "hsl(var(--muted))";
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invitations</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Nouvelle invitation
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Inviter un utilisateur</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <Select
                value={formData.roleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, roleId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sélectionner un rôle</SelectLabel>
                    {roles?.map((role) => (
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
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {createMutation.isPending ? "Envoi..." : "Envoyer invitation"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
          <h3 className="text-lg font-semibold mb-4">Invitations envoyées</h3>
          {invitations?.length === 0 ? (
            <p className="text-muted-foreground">Aucune invitation envoyée</p>
          ) : (
            <div className="space-y-3">
              {invitations?.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{invitation.email}</span>
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            getStatusColor(invitation.status) + "20",
                          color: getStatusColor(invitation.status),
                        }}
                      >
                        {invitation.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Rôle: {invitation.role.name} • Expire le{" "}
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  {invitation.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(invitation.id)}
                      disabled={cancelMutation.isPending}
                      className="text-destructive hover:text-destructive/90 px-3 py-1 text-sm"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
