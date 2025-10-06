"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, ShoppingCart } from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/use-currency";

interface WarehouseStatsCardsProps {
  organizationId: string;
  stock: Array<{ quantity: number; product: { unitPrice: number } }> | undefined;
  purchaseOrders: Array<{ status: string }> | undefined;
}

export function WarehouseStatsCards({ organizationId, stock, purchaseOrders }: WarehouseStatsCardsProps) {
  const formatCurrency = useCurrencyFormatter(organizationId);

  const stats = [
    {
      label: "Produits en stock",
      value: stock?.length || 0,
      icon: Package,
    },
    {
      label: "Quantité totale",
      value: stock?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      icon: TrendingUp,
    },
    {
      label: "Commandes en cours",
      value: purchaseOrders?.filter(o => o.status !== "RECEIVED" && o.status !== "CANCELLED").length || 0,
      icon: ShoppingCart,
    },
    {
      label: "Valeur du stock",
      value: formatCurrency(stock?.reduce((sum, item) => sum + item.quantity * item.product.unitPrice, 0) || 0),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
