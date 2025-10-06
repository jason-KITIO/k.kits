"use client";

import { useState } from "react";
import { useInvitations, useCreateInvitation, useCancelInvitation } from "@/hooks/use-invitations";
import { useRoles } from "@/hooks/use-roles";
import { CreateInvitationData, Invitation } from "@/types/invitation";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";
import { InvitationForm } from "./list/InvitationForm";
import { InvitationItem } from "./list/InvitationItem";

interface InvitationListProps {
  organizationId: string;
}

export function InvitationList({ organizationId }: InvitationListProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateInvitationData>({ email: "", roleId: "" });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-6 w-[80px]" />
                    </div>
                    <Skeleton className="h-3 w-[200px] mt-1" />
                  </div>
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <InvitationForm
          formData={formData}
          roles={roles as any}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isPending={createMutation.isPending}
        />
      )}

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invitations envoyées</h3>
          {(invitations as any)?.length === 0 ? (
            <p className="text-muted-foreground">Aucune invitation envoyée</p>
          ) : (
            <div className="space-y-3">
              {(invitations as any)?.map((invitation: Invitation) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  onCancel={handleCancel}
                  isPending={cancelMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
