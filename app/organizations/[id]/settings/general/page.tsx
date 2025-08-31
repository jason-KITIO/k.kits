"use client";

import { GeneralSettings } from "@/components/settings";
import { useParams } from "next/navigation";

export default function GeneralSettingsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <GeneralSettings organizationId={organizationId} />
    </div>
  );
}
