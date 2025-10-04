import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

// Dashboard Skeletons
export const DashboardSkeleton = () => (
  <div className="space-y-8 p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Skeleton className="h-10 w-[120px]" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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
    
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-10 w-[100px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-10 w-[100px]" />
    </div>
    <div className="rounded-md border">
      <div className="border-b p-4">
        <div className="flex space-x-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[100px]" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b p-4 last:border-b-0">
          <div className="flex space-x-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[100px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-[120px]" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-[80px]" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-[100px]" />
      <Skeleton className="h-10 w-[80px]" />
    </div>
  </div>
);

// Card List Skeleton
export const CardListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[80%]" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Sidebar Skeleton
export const SidebarSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[120px]" />
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-8 w-[100px]" />
      <div className="space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <div className="flex space-x-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-[80px]" />
      ))}
    </div>
  </div>
);

// Stats Cards Skeleton
export const StatsCardsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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