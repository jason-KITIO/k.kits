"use client";

import { CreateTransfer } from "@/components/transfers";
import { useParams } from "next/navigation";

export default function CreateTransferPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <CreateTransfer organizationId={organizationId} />
    </div>
  );
}
