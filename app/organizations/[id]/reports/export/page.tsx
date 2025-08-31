"use client";

import { DataExport } from "@/components/reports";
import { useParams } from "next/navigation";

export default function DataExportPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <DataExport organizationId={organizationId} />
    </div>
  );
}
