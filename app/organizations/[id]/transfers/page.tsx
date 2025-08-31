"use client";

import { TransferHistory } from "@/components/transfers";
import { useParams } from "next/navigation";

export default function TransfersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <TransferHistory organizationId={organizationId} />
    </div>
  );
}
