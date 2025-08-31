"use client";

import { CreateSupplier } from "@/components/suppliers";
import { useParams } from "next/navigation";

export default function CreateSupplierPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <CreateSupplier organizationId={organizationId} />
    </div>
  );
}
