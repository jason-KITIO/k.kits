"use client";

import { UsersManagement } from "@/components/settings";
import { useParams } from "next/navigation";

export default function UsersManagementPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <UsersManagement organizationId={organizationId} />
    </div>
  );
}
