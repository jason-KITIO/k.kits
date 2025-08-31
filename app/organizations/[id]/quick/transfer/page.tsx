"use client";

import { QuickTransfer } from "@/components/quick-actions";
import { useParams } from "next/navigation";

export default function QuickTransferPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <QuickTransfer organizationId={organizationId} />
    </div>
  );
}
