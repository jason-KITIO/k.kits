"use client";

import { CategoriesManager } from "@/components/categories";
import { useParams } from "next/navigation";

export default function CategoriesPage() {
  const params = useParams();
  const organizationId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <CategoriesManager organizationId={organizationId} />
    </div>
  );
}
