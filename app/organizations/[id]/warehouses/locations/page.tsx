"use client";

import { LocationsManager } from "@/components/warehouses";
import { useParams } from "next/navigation";

export default function LocationsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <LocationsManager organizationId={organizationId} />
    </div>
  );
}
