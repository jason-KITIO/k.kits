"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: "form" | "table" | "details" | "stats";
  rows?: number;
  columns?: number;
}

export function LoadingSkeleton({ type, rows = 5, columns = 4 }: LoadingSkeletonProps) {
  if (type === "form") {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80 mt-2" />
          </div>
        </div>
        
        <div className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: columns }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[120px]" />
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
                  {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-[100px]" />
                  ))}
                </div>
              </div>
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="border-b p-4 last:border-b-0">
                  <div className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, j) => (
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
  }

  return (
    <div className="p-6">
      <Skeleton className="h-8 w-[200px] mb-4" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}