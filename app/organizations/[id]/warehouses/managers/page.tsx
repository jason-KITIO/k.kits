"use client";

import { WarehouseManagers } from "@/components/warehouses";
import { useParams } from "next/navigation";

export default function WarehouseManagersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <WarehouseManagers organizationId={organizationId} />
    </div>
  );
}
