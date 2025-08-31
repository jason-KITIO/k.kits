"use client";

import { StockRequests } from "@/components/employee-stock";
import { useParams } from "next/navigation";

export default function StockRequestsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <StockRequests organizationId={organizationId} />
    </div>
  );
}
