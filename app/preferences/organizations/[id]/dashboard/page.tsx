import { Suspense } from "react";
import { DashboardContent, DashboardLoading } from "@/components/organisms";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { id: organizationId } = await params;

  
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent organizationId={organizationId} />
    </Suspense>
  );
}
