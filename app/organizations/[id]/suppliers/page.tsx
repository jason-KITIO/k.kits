"use client";

import { SuppliersList } from "@/components/suppliers";
import { useParams } from "next/navigation";

export default function SuppliersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <SuppliersList organizationId={organizationId} />
    </div>
  );
}
