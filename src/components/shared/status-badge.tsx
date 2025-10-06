"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      RECEIVED: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      PAID: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      UNPAID: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <Badge 
      variant={variant} 
      className={variant ? undefined : getStatusColor(status)}
    >
      {status}
    </Badge>
  );
}