import { LoadingCard } from "@/components/atoms";
import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationsLoading() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-9 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
