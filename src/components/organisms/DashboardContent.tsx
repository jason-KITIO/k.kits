"use client";

import { useOrganizationDashboard, useStockAlerts } from "@/hooks/useOrganization";
import { DashboardHeader } from "./DashboardHeader";
import { MetricsGrid } from "./MetricsGrid";
import { AlertsCard } from "./AlertsCard";
import { ActivityCard } from "./ActivityCard";
import { DashboardLoading } from "./DashboardLoading";

interface DashboardContentProps {
  organizationId: string;
}

export function DashboardContent({ organizationId }: DashboardContentProps) {
  const { data: dashboard, isLoading: dashboardLoading } = useOrganizationDashboard(organizationId);
  const { data: stockAlerts, isLoading: alertsLoading } = useStockAlerts(organizationId);

  if (dashboardLoading || alertsLoading) {
    return <DashboardLoading />;
  }

  const totalProducts = dashboard?.overview.totalProducts || 0;
  const totalStores = dashboard?.overview.totalStores || 0;
  const lowStockCount = dashboard?.overview.lowStockProducts || 0;
  const todaySales = dashboard?.sales.todayAmount || 0;
  const todayCount = dashboard?.sales.todayCount || 0;
  const totalValue = dashboard?.stock.totalValue || 0;
  const lowStockPercentage = totalProducts > 0 ? (lowStockCount / totalProducts) * 100 : 0;

  return (
    <div className="space-y-8 p-6">
      <DashboardHeader organizationId={organizationId} />
      
      <MetricsGrid
        lowStockCount={lowStockCount}
        lowStockPercentage={lowStockPercentage}
        totalStores={totalStores}
        todayCount={todayCount}
        todaySales={todaySales}
        totalValue={totalValue}
        totalProducts={totalProducts}
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <AlertsCard organizationId={organizationId} stockAlerts={stockAlerts} />
        <ActivityCard organizationId={organizationId} recentActivity={dashboard?.recentActivity} />
      </div>
    </div>
  );
}
