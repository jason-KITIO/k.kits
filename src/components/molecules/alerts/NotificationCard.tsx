"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Bell, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/notification";

const priorityConfig = {
  LOW: { icon: Info, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/50", variant: "secondary" as const },
  MEDIUM: { icon: Bell, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/50", variant: "outline" as const },
  HIGH: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/50", variant: "default" as const },
  CRITICAL: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/50", variant: "destructive" as const },
};

export function NotificationCard({ notification }: { notification: NotificationType }) {
  const priority = priorityConfig[notification.priority];
  const Icon = priority.icon;

  return (
    <Card className={cn(
      "transition-all hover:shadow-lg border-0 bg-gradient-to-r from-background to-muted/20",
      !notification.read && "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-xl shadow-sm", priority.bg)}>
            <Icon className={cn("h-5 w-5", priority.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn("font-medium truncate", !notification.read && "font-semibold")}>
                {notification.title}
              </h3>
              <Badge variant={priority.variant} className="text-xs">{notification.priority}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
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
