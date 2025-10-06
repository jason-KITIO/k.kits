"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useNotifications, useMarkNotificationsRead, useStockAlerts } from "@/hooks/useOrganization";
import { NotificationsTab } from "@/components/organisms/alerts/NotificationsTab";
import { StockAlertsTab } from "@/components/organisms/alerts/StockAlertsTab";
import { StockRequestsTab } from "@/components/organisms/alerts/StockRequestsTab";
import { AlertsPageHeader } from "@/components/pages/alerts/AlertsPageHeader";
import { AlertsTabsList } from "@/components/pages/alerts/AlertsTabsList";

export default function AlertsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [activeTab, setActiveTab] = useState("notifications");

  const { data: notifications, isLoading: notificationsLoading } = useNotifications(organizationId);
  const { data: alerts, isLoading: alertsLoading } = useStockAlerts(organizationId);
  const markAsRead = useMarkNotificationsRead(organizationId);

  const unreadCount = notifications?.filter((n: { read: boolean }) => !n.read).length || 0;
  const criticalAlertsCount = alerts?.filter((a: { urgency: string }) => a.urgency === "CRITICAL").length || 0;

  return (
    <div className="space-y-6 p-6">
      <AlertsPageHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <AlertsTabsList unreadCount={unreadCount} criticalAlertsCount={criticalAlertsCount} />

        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab 
            notifications={notifications}
            isLoading={notificationsLoading}
            onMarkAllRead={() => markAsRead.mutate({ markAllAsRead: true })}
            isMarkingRead={markAsRead.isPending}
          />
        </TabsContent>

        <TabsContent value="stock-alerts" className="space-y-6">
          <StockAlertsTab alerts={alerts} isLoading={alertsLoading} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <StockRequestsTab organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
