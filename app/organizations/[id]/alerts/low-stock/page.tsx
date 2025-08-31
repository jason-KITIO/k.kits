"use client";

import { LowStockAlerts } from "@/components/alerts";
import { useParams } from "next/navigation";

export default function LowStockAlertsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <LowStockAlerts organizationId={organizationId} />
    </div>
  );
}
