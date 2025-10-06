"use client";

import { Invitation } from "@/types/invitation";

interface InvitationItemProps {
  invitation: Invitation;
  onCancel: (id: string) => void;
  isPending: boolean;
}

export function InvitationItem({ invitation, onCancel, isPending }: InvitationItemProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-medium">{invitation.email}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(invitation.status)}`}>
            {invitation.status}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Rôle: {invitation.role.name} • Expire le {new Date(invitation.expiresAt).toLocaleDateString()}
        </div>
      </div>
      {invitation.status === "PENDING" && (
        <button
          onClick={() => onCancel(invitation.id)}
          disabled={isPending}
          className="text-destructive hover:text-destructive/90 px-3 py-1 text-sm"
        >
          Annuler
        </button>
      )}
    </div>
  );
}
