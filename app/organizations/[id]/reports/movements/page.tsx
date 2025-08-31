"use client";

import { MovementsReport } from "@/components/reports";
import { useParams } from "next/navigation";

export default function MovementsReportPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <MovementsReport organizationId={organizationId} />
    </div>
  );
}
