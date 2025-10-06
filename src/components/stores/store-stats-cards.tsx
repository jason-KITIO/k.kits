"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/use-currency";

interface StoreStatsCardsProps {
  organizationId: string;
  stats: {
    totalProducts?: number;
    totalStock?: number;
    totalSales?: number;
    totalValue?: number;
    totalCustomers?: number;
  };
}

export function StoreStatsCards({ organizationId, stats }: StoreStatsCardsProps) {
  const formatCurrency = useCurrencyFormatter(organizationId);

  const cards = [
    { label: "Produits", value: stats.totalProducts || 0, icon: Package },
    { label: "Stock Total", value: stats.totalStock || 0, icon: TrendingUp },
    { label: "Ventes", value: stats.totalSales || 0, icon: ShoppingCart },
    { label: "Valeur", value: formatCurrency(stats.totalValue || 0), icon: TrendingUp },
    { label: "Clients", value: stats.totalCustomers || 0, icon: Users },
  ].filter(c => c.value !== undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
