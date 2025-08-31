"use client";

import { QuickStockIn } from "@/components/quick-actions";
import { useParams } from "next/navigation";

export default function QuickStockInPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <QuickStockIn organizationId={organizationId} />
    </div>
  );
}
