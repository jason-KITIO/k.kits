"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useNotifications,
  useMarkNotificationsRead,
  useStockAlerts,
} from "@/hooks/useOrganization";
import { useOptimizedQuery } from "@/hooks/use-optimized-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  BellOff,
  CheckCheck,
  AlertTriangle,
  Info,
  AlertCircle,
  Package,
  ShoppingCart,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/notification";
import { StockAlert } from "@/types/stock-alert";
import Link from "next/link";

const priorityConfig = {
  LOW: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    variant: "secondary" as const,
  },
  MEDIUM: {
    icon: Bell,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/50",
    variant: "outline" as const,
  },
  HIGH: {
    icon: AlertCircle,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/50",
    variant: "default" as const,
  },
  CRITICAL: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/50",
    variant: "destructive" as const,
  },
};

const urgencyConfig = {
  CRITICAL: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    badge: "destructive" as const,
    icon: AlertTriangle,
  },
  HIGH: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    badge: "default" as const,
    icon: TrendingDown,
  },
  MEDIUM: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
    badge: "secondary" as const,
    icon: Package,
  },
};

function NotificationSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StockAlertSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationCard({
  notification,
}: {
  notification: NotificationType;
}) {
  const priority = priorityConfig[notification.priority];
  const Icon = priority.icon;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border-0 bg-gradient-to-r from-background to-muted/20",
        !notification.read && "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-xl shadow-sm", priority.bg)}>
            <Icon className={cn("h-5 w-5", priority.color)} />
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

function StockAlertCard({ alert }: { alert: StockAlert }) {
  const config = urgencyConfig[alert.urgency as keyof typeof urgencyConfig];
  const Icon = config.icon;
  const location =
    alert.store?.name || alert.warehouse?.name || "Localisation inconnue";

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border-0", config.bg)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-background dark:bg-card shadow-sm border">
            <Icon className={cn("h-6 w-6", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold truncate">{alert.product.name}</h3>
              <Badge variant={config.badge}>{alert.urgency}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              SKU: {alert.product.sku} • {location}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock actuel</span>
                <span className={cn("font-medium", config.color)}>
                  {alert.quantity} / {alert.product.minStock} unités
                </span>
              </div>
              <Progress value={alert.percentageLeft || 0} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {alert.percentageLeft?.toFixed(1) || '0'}% du seuil minimum
                </span>
                <span className="text-sm font-medium">
                  {alert.product.unitPrice?.toLocaleString() || '0'} FCFA/unité
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AlertsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [activeTab, setActiveTab] = useState("notifications");

  const { data: notifications, isLoading: notificationsLoading } =
    useNotifications(organizationId);
  const { data: alerts, isLoading: alertsLoading } =
    useStockAlerts(organizationId);
  const markAsRead = useMarkNotificationsRead(organizationId);

  const unreadCount =
    notifications?.filter((n: NotificationType) => !n.read).length || 0;
  const criticalAlertsCount =
    alerts?.filter((a: StockAlert) => a.urgency === "CRITICAL").length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="border-b border-border/50 pb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Alertes & Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos notifications et alertes de stock en temps réel
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="stock-alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertes Stock
            {criticalAlertsCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {criticalAlertsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Requêtes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="grid gap-6 md:grid-cols-3 flex-1">
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {notifications?.length || 0}
                  </div>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Notifications</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Non lues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {unreadCount}
                  </div>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">À traiter</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                    Urgentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {notifications?.filter(
                      (n: NotificationType) =>
                        n.priority === "CRITICAL" && !n.read
                    ).length || 0}
                  </div>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">
                    Priorité critique
                  </p>
                </CardContent>
              </Card>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={() => markAsRead.mutate({ markAllAsRead: true })}
                disabled={markAsRead.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {notificationsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))
            ) : notifications && notifications.length > 0 ? (
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
                  <h3 className="text-lg font-medium mb-2">
                    Aucune notification
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Vous n'avez aucune notification pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stock-alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="grid gap-6 md:grid-cols-4 flex-1">
              <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Total alertes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                    {alerts?.length || 0}
                  </div>
                  <p className="text-xs text-slate-600/70 dark:text-slate-400/70">
                    Produits concernés
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                    Critiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {criticalAlertsCount}
                  </div>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">Stock épuisé</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Urgentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {alerts?.filter((a: StockAlert) => a.urgency === "HIGH")
                      .length || 0}
                  </div>
                  <p className="text-xs text-orange-600/70 dark:text-orange-400/70">
                    Stock très bas
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                    Valeur impactée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {alerts
                      ?.reduce(
                        (sum: number, alert: StockAlert) =>
                          sum + (alert.product.unitPrice || 0) * alert.quantity,
                        0
                      )
                      ?.toLocaleString() || 0}{" "}
                    FCFA
                  </div>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70">Stock restant</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {alertsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <StockAlertSkeleton key={i} />
              ))
            ) : alerts && alerts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alerts.map((alert: StockAlert) => (
                  <StockAlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-green-600">
                    Aucune alerte !
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Excellent ! Tous vos produits ont un stock suffisant.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <StockRequestsTab organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StockRequestsTab({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient();

  const { data: stockRequests, isLoading: requestsLoading } = useOptimizedQuery(
    {
      queryKey: ["stock-movement-requests", organizationId],
      queryFn: async () => {
        const response = await fetch(
          `/api/organization/${organizationId}/stock-movement-requests`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des requêtes");
        }
        return response.json();
      },
      enabled: !!organizationId,
    }
  );

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(
        `/api/organization/${organizationId}/stock-movement-requests/${requestId}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de l'approbation");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-movement-requests", organizationId],
      });
      toast.success("Requête approuvée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'approbation");
    },
  });

  const approveRequest = (requestId: string) => {
    approveMutation.mutate(requestId);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requêtes de mouvement de stock</CardTitle>
      </CardHeader>
      <CardContent>
        {requestsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : stockRequests && stockRequests.length > 0 ? (
          <div className="space-y-4">
            {stockRequests.map((request: any) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{request.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {request.product.sku} • Quantité: {request.quantity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {request.fromWarehouse?.name || 'Entrepôt'} → {request.toStore?.name || 'Boutique'}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {request.requester.firstName} {request.requester.lastName}
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status === "PENDING"
                      ? "En attente"
                      : request.status === "APPROVED"
                      ? "Approuvée"
                      : "Rejetée"}
                  </Badge>
                  {request.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => approveRequest(request.id)}
                      disabled={approveMutation.isPending}
                    >
                      Approuver
                    </Button>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune requête</h3>
            <p className="text-muted-foreground">
              Aucune requête de mouvement de stock pour le moment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
