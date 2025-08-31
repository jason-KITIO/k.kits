"use client";

import { InventoryReports } from "@/components/inventories";
import { useParams } from "next/navigation";

export default function InventoryReportsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <InventoryReports organizationId={organizationId} />
    </div>
  );
}
