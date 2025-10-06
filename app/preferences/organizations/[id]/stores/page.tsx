"use client";

import { useParams } from "next/navigation";
import { useStores } from "@/hooks/useStore";
import { PageProtection } from "@/components/page-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { StoresStats } from "@/components/organisms/stores/StoresStats";
import { StoresGrid } from "@/components/organisms/stores/StoresGrid";
import { StoresPageHeader } from "@/components/pages/stores/StoresPageHeader";
import { StoresLoadingSkeleton } from "@/components/pages/stores/StoresLoadingSkeleton";

export default function StoresPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const { data: stores, isLoading, error } = useStores(organizationId);

  if (isLoading) return <StoresLoadingSkeleton />;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <PageProtection requiredPermission={PERMISSIONS.ORG_SETTINGS} organizationId={organizationId} fallbackUrl={`/preferences/organizations/${organizationId}/dashboard`}>
      <div className="space-y-6 p-6">
        <StoresPageHeader organizationId={organizationId} />
        <StoresStats stores={stores || []} />
        <StoresGrid stores={stores || []} organizationId={organizationId} />
      </div>
    </PageProtection>
  );
}
