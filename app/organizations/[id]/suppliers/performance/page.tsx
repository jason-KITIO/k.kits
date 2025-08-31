"use client";

import { SupplierPerformance } from "@/components/suppliers";
import { useParams } from "next/navigation";

export default function SupplierPerformancePage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <SupplierPerformance organizationId={organizationId} />
    </div>
  );
}
