"use client";

import { PurchaseOrders } from "@/components/purchases";
import { useParams } from "next/navigation";

export default function PurchaseOrdersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <PurchaseOrders organizationId={organizationId} />
    </div>
  );
}
