"use client";

import { QuickAlert } from "@/components/quick-actions";
import { useParams } from "next/navigation";

export default function QuickAlertPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <QuickAlert organizationId={organizationId} />
    </div>
  );
}
