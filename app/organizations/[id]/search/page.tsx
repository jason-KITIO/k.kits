"use client";

import { QuickSearch } from "@/components/quick-actions";
import { useParams } from "next/navigation";

export default function SearchPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <QuickSearch organizationId={organizationId} />
    </div>
  );
}
