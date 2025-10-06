"use client";

import { useParams } from "next/navigation";
import { ReportDashboard } from "@/components/reports/report-dashboard";
import { ReportsPageHeader } from "@/components/pages/reports-page/ReportsPageHeader";

export default function ReportsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="space-y-6 p-6">
      <ReportsPageHeader organizationId={organizationId} />
      <ReportDashboard organizationId={organizationId} />
    </div>
  );
}