"use client";

import { OutOfStockAlerts } from "@/components/alerts";
import { useParams } from "next/navigation";

export default function OutOfStockAlertsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <OutOfStockAlerts organizationId={organizationId} />
    </div>
  );
}
