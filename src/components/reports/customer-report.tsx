"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, Repeat, Crown } from "lucide-react";
import type { CustomerReport } from "@/schema/report.schema";

interface CustomerReportProps {
  data: CustomerReport;
  isLoading?: boolean;
}

export function CustomerReportComponent({ data, isLoading }: CustomerReportProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const retentionRate = data.totalCustomers > 0 ? (data.returningCustomers / data.totalCustomers) * 100 : 0;

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

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Base clients active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.newCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Cette période
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients fidèles</CardTitle>
            <Repeat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.returningCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Achats multiples
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de fidélité</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {retentionRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={retentionRate} className="flex-1 h-2" />
              <Badge variant={retentionRate >= 50 ? "default" : "secondary"}>
                {retentionRate >= 50 ? "Bon" : "À améliorer"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top clients */}
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
              {data.topCustomers.slice(0, 15).map((customer, index) => {
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
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(customer.totalSpent)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XAF'
                      }).format(avgOrder)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')
                        : "Jamais"
                      }
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

      {/* Évolution de la clientèle */}
      {data.customersByPeriod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la clientèle</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">Nouveaux clients</TableHead>
                  <TableHead className="text-right">Total clients</TableHead>
                  <TableHead className="text-right">Croissance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.customersByPeriod.map((period, index) => {
                  const previousPeriod = data.customersByPeriod[index - 1];
                  const growth = previousPeriod 
                    ? ((period.newCustomers - previousPeriod.newCustomers) / previousPeriod.newCustomers) * 100
                    : 0;
                  
                  return (
                    <TableRow key={period.period}>
                      <TableCell className="font-medium">{period.period}</TableCell>
                      <TableCell className="text-right text-green-600">
                        +{period.newCustomers}
                      </TableCell>
                      <TableCell className="text-right">{period.totalCustomers}</TableCell>
                      <TableCell className="text-right">
                        {index > 0 && (
                          <Badge variant={growth >= 0 ? "default" : "destructive"}>
                            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Analyses de segmentation */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clients VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topCustomers
                .filter(c => c.totalSpent > 100000 || c.orderCount > 10)
                .slice(0, 5)
                .map((customer, index) => (
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
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(customer.totalSpent)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.orderCount} commandes
                      </div>
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
              {data.topCustomers
                .filter(c => {
                  if (!c.lastOrderDate) return true;
                  const daysSinceLastOrder = (Date.now() - new Date(c.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24);
                  return daysSinceLastOrder > 90;
                })
                .slice(0, 5)
                .map((customer) => (
                  <div key={customer.customerId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">⏰</Badge>
                      <span className="font-medium">{customer.customerName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-600 font-bold">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(customer.totalSpent)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.lastOrderDate 
                          ? `Dernière: ${new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}`
                          : "Jamais commandé"
                        }
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}