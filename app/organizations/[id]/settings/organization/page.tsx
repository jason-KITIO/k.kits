"use client";

import { OrganizationSettings } from "@/components/settings";
import { useParams } from "next/navigation";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <OrganizationSettings organizationId={organizationId} />
    </div>
  );
}
