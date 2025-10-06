"use client";

import { useRouter, useParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrganization, useUpdateOrganization } from "@/hooks/use-organizations";
import { OrganizationForm } from "@/components/organisms/organization/OrganizationForm";
import { OrganizationPageHeader } from "@/components/pages/organization/OrganizationPageHeader";
import { OrganizationLoadingState } from "@/components/pages/organization/OrganizationLoadingState";

export default function OrganizationEditPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  
  const { data: organization, isLoading } = useOrganization(orgId);
  const updateOrganization = useUpdateOrganization();

  const handleSubmit = (data: any) => {
    updateOrganization.mutate({ id: orgId, data }, {
      onSuccess: () => router.push("/preferences/organizations"),
    });
  };

  if (isLoading) return <OrganizationLoadingState />;

  if (!organization) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive"><AlertDescription>Organisation non trouvée</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <OrganizationPageHeader
        title="Modifier l'organisation"
        description="Modifiez les informations de votre organisation"
      />
      <OrganizationForm 
        initialData={organization}
        onSubmit={handleSubmit}
        isLoading={updateOrganization.isPending}
        error={updateOrganization.error}
        mode="edit"
        organizationId={orgId}
      />
    </div>
  );
}
