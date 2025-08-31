"use client";

import { StockAdjustments } from "@/components/employee-stock";
import { useParams } from "next/navigation";

export default function StockAdjustmentsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <StockAdjustments organizationId={organizationId} />
    </div>
  );
}
