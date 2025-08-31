"use client";

import { PermissionsManagement } from "@/components/settings";
import { useParams } from "next/navigation";

export default function PermissionsManagementPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <PermissionsManagement organizationId={organizationId} />
    </div>
  );
}
