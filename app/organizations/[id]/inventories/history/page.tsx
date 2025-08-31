"use client";

import { InventoryHistory } from "@/components/inventories";
import { useParams } from "next/navigation";

export default function InventoryHistoryPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <InventoryHistory organizationId={organizationId} />
    </div>
  );
}
