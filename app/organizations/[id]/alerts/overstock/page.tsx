"use client";

import { OverstockAlerts } from "@/components/alerts";
import { useParams } from "next/navigation";

export default function OverstockAlertsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <OverstockAlerts organizationId={organizationId} />
    </div>
  );
}
