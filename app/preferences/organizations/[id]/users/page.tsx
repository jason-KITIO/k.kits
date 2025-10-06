"use client";

import { useParams } from "next/navigation";
import { useOrganizationUsers } from "@/hooks/useOrganization";
import { UsersStats } from "@/components/organisms/users/UsersStats";
import { RoleDistribution } from "@/components/organisms/users/RoleDistribution";
import { UsersTable } from "@/components/organisms/users/UsersTable";
import { UsersPageHeader } from "@/components/pages/users/UsersPageHeader";
import { UsersLoadingSkeleton } from "@/components/pages/users/UsersLoadingSkeleton";

export default function UsersPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const { data: members, isLoading, error } = useOrganizationUsers(organizationId);

  if (isLoading) return <UsersLoadingSkeleton />;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <UsersPageHeader organizationId={organizationId} />
      <UsersStats members={members || []} />
      <RoleDistribution members={members || []} />
      <UsersTable members={members || []} />
    </div>
  );
}
