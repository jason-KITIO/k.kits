"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/use-alerts";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  AlertTriangle,
  ArrowRightLeft,
  ClipboardList,
  ShoppingCart,
} from "lucide-react";

interface NotificationsProps {
  organizationId: string;
}

export function Notifications({ organizationId }: NotificationsProps) {
  const { data: notifications = [], isLoading } =
    useNotifications(organizationId);
  const markAsReadMutation = useMarkNotificationAsRead(organizationId);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      toast.success("Notification marquée comme lue");
    } catch {
      toast.error("Erreur lors du marquage");
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      STOCK_ALERT: AlertTriangle,
      TRANSFER: ArrowRightLeft,
      INVENTORY: ClipboardList,
      PURCHASE_ORDER: ShoppingCart,
    };

    return icons[type as keyof typeof icons] || Bell;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) return <div>Chargement des notifications...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount} non lues</Badge>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune notification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const TypeIcon = getTypeIcon(notification.type);

            return (
              <Card
                key={notification.id}
                className={notification.isRead ? "opacity-60" : ""}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-5 w-5" />
                      <span className="text-base">{notification.title}</span>
                    </div>
                    {!notification.isRead && (
                      <Badge variant="destructive">Nouveau</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>

                    {!notification.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
