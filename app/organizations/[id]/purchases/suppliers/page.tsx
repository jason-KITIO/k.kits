"use client";

import { SuppliersManager } from "@/components/purchases";
import { useParams } from "next/navigation";

export default function SuppliersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <SuppliersManager organizationId={organizationId} />
    </div>
  );
}
