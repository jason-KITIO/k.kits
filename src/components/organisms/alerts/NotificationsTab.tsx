"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BellOff, CheckCheck } from "lucide-react";
import { NotificationCard } from "@/components/molecules/alerts/NotificationCard";
import { AlertsStats } from "@/components/molecules/alerts/AlertsStats";
import { NotificationType } from "@/types/notification";

interface NotificationsTabProps {
  notifications?: NotificationType[];
  isLoading: boolean;
  onMarkAllRead: () => void;
  isMarkingRead: boolean;
}

export function NotificationsTab({ notifications, isLoading, onMarkAllRead, isMarkingRead }: NotificationsTabProps) {
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const urgentCount = notifications?.filter(n => n.priority === "CRITICAL" && !n.read).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-6 md:grid-cols-3 flex-1">
            {[...Array(3)].map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AlertsStats 
          total={notifications?.length || 0}
          unread={unreadCount}
          urgent={urgentCount}
          type="notifications"
        />
        {unreadCount > 0 && (
          <Button onClick={onMarkAllRead} disabled={isMarkingRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {notifications && notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p className="text-muted-foreground text-center">
                Vous n'avez aucune notification pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
