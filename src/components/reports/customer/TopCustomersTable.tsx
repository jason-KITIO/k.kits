"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Repeat, Crown } from "lucide-react";
import { Currency } from "../shared/CurrencyFormatter";

interface TopCustomer {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

const getCustomerTypeColor = (orderCount: number, totalSpent: number) => {
  if (totalSpent > 100000 || orderCount > 10) return "text-purple-600";
  if (totalSpent > 50000 || orderCount > 5) return "text-blue-600";
  if (orderCount > 1) return "text-green-600";
  return "text-gray-600";
};

const getCustomerBadge = (orderCount: number, totalSpent: number) => {
  if (totalSpent > 100000 || orderCount > 10) return { variant: "default" as const, label: "VIP", icon: Crown };
  if (totalSpent > 50000 || orderCount > 5) return { variant: "secondary" as const, label: "Fidèle", icon: Repeat };
  if (orderCount > 1) return { variant: "outline" as const, label: "Régulier", icon: Users };
  return { variant: "outline" as const, label: "Nouveau", icon: UserPlus };
};

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 15 des meilleurs clients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Commandes</TableHead>
              <TableHead className="text-right">Total dépensé</TableHead>
              <TableHead className="text-right">Panier moyen</TableHead>
              <TableHead className="text-right">Dernière commande</TableHead>
              <TableHead className="text-right">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.slice(0, 15).map((customer, index) => {
              const avgOrder = customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 0;
              const badge = getCustomerBadge(customer.orderCount, customer.totalSpent);
              const IconComponent = badge.icon;

              return (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      {customer.customerName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{customer.orderCount}</TableCell>
                  <TableCell className="text-right">
                    <span className={getCustomerTypeColor(customer.orderCount, customer.totalSpent)}>
                      <Currency amount={customer.totalSpent} />
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Currency amount={avgOrder} />
                  </TableCell>
                  <TableCell className="text-right">
                    {customer.lastOrderDate
                      ? new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')
                      : "Jamais"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={badge.variant} className="flex items-center gap-1">
                      <IconComponent className="h-3 w-3" />
                      {badge.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
