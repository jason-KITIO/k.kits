"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

interface StatsCardsProps {
  stats: StatCard[];
  columns?: number;
}

export function StatsCards({ stats, columns = 4 }: StatsCardsProps) {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-6`;
  
  return (
    <div className={gridClass}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.className || 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
