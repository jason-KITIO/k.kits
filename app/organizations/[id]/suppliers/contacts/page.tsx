"use client";

import { SupplierContacts } from "@/components/suppliers";
import { useParams } from "next/navigation";

export default function SupplierContactsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <SupplierContacts organizationId={organizationId} />
    </div>
  );
}
