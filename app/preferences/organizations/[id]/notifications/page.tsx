"use client";

import { useParams } from "next/navigation";
import {
  useNotifications,
  useMarkNotificationsRead,
} from "@/hooks/useOrganization";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  CheckCheck,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/notification";

const priorityConfig = {
  LOW: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50",
    variant: "secondary" as const,
  },
  MEDIUM: {
    icon: Bell,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    variant: "outline" as const,
  },
  HIGH: {
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-50",
    variant: "default" as const,
  },
  CRITICAL: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50",
    variant: "destructive" as const,
  },
};

const typeConfig = {
  system: { label: "Système", color: "text-gray-600" },
  alert: { label: "Alerte", color: "text-red-600" },
  info: { label: "Information", color: "text-blue-600" },
  create: { label: "Création", color: "text-green-600" },
};

function NotificationCard({ notification }: { notification: NotificationType }) {
  const priority = priorityConfig[notification.priority];
  const type = typeConfig[notification.type];
  const Icon = priority.icon;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        !notification.read && "border-l-4 border-l-primary bg-muted/30"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full", priority.bg)}>
            <Icon className={cn("h-4 w-4", priority.color)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={cn(
                  "font-medium truncate",
                  !notification.read && "font-semibold"
                )}
              >
                {notification.title}
              </h3>
              <Badge variant={priority.variant} className="text-xs">
                {notification.priority}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {type.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {notification.message}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
              {!notification.read && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Non lu
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const {
    data: notifications,
    isLoading,
    error,
  } = useNotifications(organizationId);
  const markAsRead = useMarkNotificationsRead(organizationId);

  if (isLoading) return <PageLoader text="Chargement des notifications..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const unreadCount = notifications?.filter((n: NotificationType) => !n.read).length || 0;
  const criticalCount =
    notifications?.filter((n: NotificationType) => n.priority === "CRITICAL" && !n.read)
      .length || 0;

  const handleMarkAllAsRead = () => {
    markAsRead.mutate({ markAllAsRead: true });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Alertes et informations importantes de votre organisation
          </p>
        </div>

        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} disabled={markAsRead.isPending}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {unreadCount}
            </div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Priorité critique</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification: NotificationType) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
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
