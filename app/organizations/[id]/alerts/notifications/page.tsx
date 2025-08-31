"use client";

import { Notifications } from "@/components/alerts";
import { useParams } from "next/navigation";

export default function NotificationsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <Notifications organizationId={organizationId} />
    </div>
  );
}
