import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Package } from "lucide-react";

interface AlertsTabsListProps {
  unreadCount: number;
  criticalAlertsCount: number;
}

export function AlertsTabsList({ unreadCount, criticalAlertsCount }: AlertsTabsListProps) {
  return (
    <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
        {unreadCount > 0 && <Badge variant="destructive" className="ml-1 text-xs">{unreadCount}</Badge>}
      </TabsTrigger>
      <TabsTrigger value="stock-alerts" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Alertes Stock
        {criticalAlertsCount > 0 && <Badge variant="destructive" className="ml-1 text-xs">{criticalAlertsCount}</Badge>}
      </TabsTrigger>
      <TabsTrigger value="requests" className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        Requêtes
      </TabsTrigger>
    </TabsList>
  );
}
