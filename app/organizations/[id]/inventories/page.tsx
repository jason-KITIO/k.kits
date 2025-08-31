"use client";

import { ActiveInventories } from "@/components/inventories";
import { useParams } from "next/navigation";

export default function InventoriesPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <ActiveInventories organizationId={organizationId} />
    </div>
  );
}
