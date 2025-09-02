"use client";

import { InvitationList } from "@/components/invitations/invitation-list";
import { useOrganizationIdFromUrl } from "@/helper/get-orgnisation-id";
import { useOrganization } from "@/hooks/use-organization";

export default function page() {
  const organizationId = useOrganizationIdFromUrl();
  if (!organizationId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Aucune organisation sélectionnée
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }
  return <InvitationList organizationId={organizationId} />;
}
