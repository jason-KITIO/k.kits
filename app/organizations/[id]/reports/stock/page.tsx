"use client";

import { StockReport } from "@/components/reports";
import { useParams } from "next/navigation";

export default function StockReportPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <StockReport organizationId={organizationId} />
    </div>
  );
}
