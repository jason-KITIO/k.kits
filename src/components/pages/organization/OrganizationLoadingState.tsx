import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationLoadingState() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
