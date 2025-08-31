"use client";

import { PurchaseReceipts } from "@/components/purchases";
import { useParams } from "next/navigation";

export default function PurchaseReceiptsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <PurchaseReceipts organizationId={organizationId} />
    </div>
  );
}
