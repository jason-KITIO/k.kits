import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface UseSkeletonOptions {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

/**
 * Hook pour simplifier l'affichage conditionnel des skeletons
 */
export const useSkeleton = ({ isLoading, skeleton, children }: UseSkeletonOptions) => {
  return isLoading ? skeleton : children;
};

/**
 * Hook pour gérer plusieurs états de loading
 */
export const useMultipleSkeleton = (loadingStates: boolean[], skeleton: ReactNode, children: ReactNode) => {
  const isAnyLoading = loadingStates.some(state => state);
  return isAnyLoading ? skeleton : children;
};

/**
 * Générateurs de skeletons rapides
 */
export const createTableSkeleton = (rows = 5, cols = 4) => (
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

export const createCardListSkeleton = (count = 6) => (
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

export const createFormSkeleton = () => (
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