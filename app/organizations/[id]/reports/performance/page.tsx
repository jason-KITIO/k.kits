"use client";

import { PerformanceReport } from "@/components/reports";
import { useParams } from "next/navigation";

export default function PerformanceReportPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <PerformanceReport organizationId={organizationId} />
    </div>
  );
}
