"use client";

import { WarehousesManager } from "@/components/warehouses";
import { useParams } from "next/navigation";

export default function WarehousesPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <WarehousesManager organizationId={organizationId} />
    </div>
  );
}
