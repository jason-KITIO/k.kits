"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { Currency } from "../shared/CurrencyFormatter";

interface TopCustomer {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

interface CustomerSegmentationProps {
  customers: TopCustomer[];
}

export function CustomerSegmentation({ customers }: CustomerSegmentationProps) {
  const vipCustomers = customers.filter(c => c.totalSpent > 100000 || c.orderCount > 10).slice(0, 5);
  const inactiveCustomers = customers.filter(c => {
    if (!c.lastOrderDate) return true;
    const daysSinceLastOrder = (Date.now() - new Date(c.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastOrder > 90;
  }).slice(0, 5);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Clients VIP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vipCustomers.map((customer) => (
              <div key={customer.customerId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    VIP
                  </Badge>
                  <span className="font-medium">{customer.customerName}</span>
                </div>
                <div className="text-right">
                  <div className="text-purple-600 font-bold">
                    <Currency amount={customer.totalSpent} />
                  </div>
                  <div className="text-xs text-muted-foreground">{customer.orderCount} commandes</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clients à réactiver</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inactiveCustomers.map((customer) => (
              <div key={customer.customerId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">⏰</Badge>
                  <span className="font-medium">{customer.customerName}</span>
                </div>
                <div className="text-right">
                  <div className="text-orange-600 font-bold">
                    <Currency amount={customer.totalSpent} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customer.lastOrderDate
                      ? `Dernière: ${new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}`
                      : "Jamais commandé"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
