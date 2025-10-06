import { Suspense } from "react";
import { OrganizationsContent } from "@/components/organisms";
import { OrganizationsLoading } from "@/components/organisms";

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<OrganizationsLoading />}>
      <OrganizationsContent />
    </Suspense>
  );
}
