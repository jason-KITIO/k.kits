"use client";

import { MyRequests } from "@/components/transfers";
import { useParams } from "next/navigation";

export default function MyRequestsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <MyRequests organizationId={organizationId} />
    </div>
  );
}
