"use client";

import { CreatePurchaseOrder } from "@/components/purchases";
import { useParams } from "next/navigation";

export default function CreatePurchaseOrderPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <CreatePurchaseOrder organizationId={organizationId} />
    </div>
  );
}
