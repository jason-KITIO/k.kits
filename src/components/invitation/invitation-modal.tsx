"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendInvitation } from "@/hooks/use-invitation";
import { useOrganizationRoles } from "@/hooks/use-organization-roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface InvitationModalProps {
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvitationModal({
  organizationId,
  open,
  onOpenChange,
}: InvitationModalProps) {
  const { data, isLoading, error } = useOrganizationRoles(organizationId);
  const sendInvitationMutation = useSendInvitation();

  const [email, setEmail] = React.useState("");
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");

  React.useEffect(() => {
    if (data?.roles?.length) {
      setSelectedRoleId(data.roles[0].id);
    }
  }, [data]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !selectedRoleId) {
      alert("Veuillez renseigner un email et sélectionner un rôle.");
      return;
    }

    sendInvitationMutation.mutate(
      { organizationId, email, roleId: selectedRoleId },
      {
        onSuccess: () => {
          alert("Invitation envoyée !");
          setEmail("");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          alert(error.message || "Erreur lors de l'envoi de l'invitation");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg sm:p-8">
        <DialogHeader>
          <DialogTitle>Inviter un utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email de l&apos;invité</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@domaine.com"
              disabled={sendInvitationMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle à attribuer</Label>
            {isLoading ? (
              <p>Chargement des rôles...</p>
            ) : error ? (
              <p className="text-destructive">Erreur chargement rôles</p>
            ) : (
              <Select
                value={selectedRoleId}
                onValueChange={(value) => setSelectedRoleId(value)}
                disabled={sendInvitationMutation.isPending}
              >
                <SelectTrigger
                  className="w-full border rounded p-2"
                  aria-label="Sélectionner un rôle"
                >
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {data?.roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendInvitationMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={sendInvitationMutation.isPending}>
              {sendInvitationMutation.isPending
                ? "Envoi..."
                : "Envoyer l'invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
