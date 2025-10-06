"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateOrganization } from "@/hooks/use-organizations";
import { OrganizationForm } from "@/components/organisms/organization/OrganizationForm";
import { OrganizationPageHeader } from "@/components/pages/organization/OrganizationPageHeader";

function OrganizationCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createOrganization = useCreateOrganization();

  const duplicateData = searchParams.get("duplicate")
    ? JSON.parse(decodeURIComponent(searchParams.get("duplicate")!))
    : undefined;

  const handleSubmit = (data: any) => {
    createOrganization.mutate(data, {
      onSuccess: () => router.push("/preferences/organizations"),
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <OrganizationPageHeader
        title="Créer une nouvelle organisation"
        description="Configurez votre organisation pour commencer"
      />
      <OrganizationForm
        initialData={duplicateData}
        onSubmit={handleSubmit}
        isLoading={createOrganization.isPending}
        error={createOrganization.error}
        mode="create"
      />
    </div>
  );
}

export default function OrganizationCreatePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <OrganizationCreateContent />
    </Suspense>
  );
}
