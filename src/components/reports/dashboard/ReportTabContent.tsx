"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ReportTabContentProps {
  isLoading: boolean;
  hasData: boolean;
  children: React.ReactNode;
}

export function ReportTabContent({ isLoading, hasData, children }: ReportTabContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Aucune donnée disponible pour cette période</p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
