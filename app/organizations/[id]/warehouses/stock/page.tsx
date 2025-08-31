"use client";

import { WarehouseStock } from "@/components/warehouses";
import { useParams } from "next/navigation";

export default function WarehouseStockPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <WarehouseStock organizationId={organizationId} />
    </div>
  );
}
