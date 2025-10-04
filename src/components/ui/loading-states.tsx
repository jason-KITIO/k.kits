import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

// Composants de loading réutilisables avec Shadcn Skeleton

export const PageHeaderSkeleton = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
    <Skeleton className="h-10 w-[120px]" />
  </div>
);

export const StatsCardsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-2" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[180px]" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="border rounded-md">
          <div className="border-b p-4">
            <div className="flex space-x-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-[100px]" />
              ))}
            </div>
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="border-b p-4 last:border-b-0">
              <div className="flex space-x-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-[100px]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const CardGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
            <Skeleton className="h-6 w-[60px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Hook pour utilisation simple
export const useLoadingState = (isLoading: boolean, skeleton: React.ReactNode, children: React.ReactNode) => {
  return isLoading ? skeleton : children;
};