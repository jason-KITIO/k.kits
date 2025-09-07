import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  className?: string;
}

const colorVariants = {
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    valueColor: "text-blue-600",
  },
  green: {
    border: "border-l-green-500", 
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    valueColor: "text-green-600",
  },
  red: {
    border: "border-l-red-500",
    iconBg: "bg-red-500/10", 
    iconColor: "text-red-500",
    valueColor: "text-red-600",
  },
  yellow: {
    border: "border-l-yellow-500",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500", 
    valueColor: "text-yellow-600",
  },
  purple: {
    border: "border-l-purple-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    valueColor: "text-purple-600",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
  className,
}: StatCardProps) {
  const colors = colorVariants[color];

  return (
    <Card className={cn("border-l-4", colors.border, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-full", colors.iconBg)}>
            <Icon className={cn("h-4 w-4", colors.iconColor)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", colors.valueColor)}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center justify-between mt-2">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"} 
              className="text-xs"
            >
              {trend.isPositive ? "+" : ""}{trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}