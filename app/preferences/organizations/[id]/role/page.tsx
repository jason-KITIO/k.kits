"use client";

import { RoleList } from "@/components/roles/role-list";
import { useOrganizationIdFromUrl } from "@/helper/get-orgnisation-id";

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
  return <RoleList organizationId={organizationId} />;
}
