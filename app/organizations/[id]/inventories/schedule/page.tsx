"use client";

import { ScheduleInventory } from "@/components/inventories";
import { useParams } from "next/navigation";

export default function ScheduleInventoryPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <ScheduleInventory organizationId={organizationId} />
    </div>
  );
}
