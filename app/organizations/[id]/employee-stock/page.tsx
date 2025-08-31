"use client";

import { EmployeeInventory } from "@/components/employee-stock";
import { useParams } from "next/navigation";

export default function EmployeeStockPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <EmployeeInventory organizationId={organizationId} />
    </div>
  );
}
