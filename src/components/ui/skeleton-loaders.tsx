import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

// Remplacements directs pour les anciens loaders

export const DefaultSkeleton = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-8 w-[80px]" />
        </div>
      ))}
    </div>
  </div>
);

export const FormSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[150px]" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
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
    </CardContent>
  </Card>
);

// Hook pour remplacer facilement les anciens loaders
export const useSkeletonLoader = (isLoading: boolean, type: 'default' | 'page' | 'list' | 'form' = 'default') => {
  if (!isLoading) return null;
  
  switch (type) {
    case 'page': return <PageSkeleton />;
    case 'list': return <ListSkeleton />;
    case 'form': return <FormSkeleton />;
    default: return <DefaultSkeleton />;
  }
};