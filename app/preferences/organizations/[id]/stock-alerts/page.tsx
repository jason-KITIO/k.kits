"use client";

import { useParams } from "next/navigation";
import { useStockAlerts } from "@/hooks/useOrganization";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Package, ShoppingCart, TrendingDown } from "lucide-react";
import { StockAlert } from "@/services/organizationService";
import { cn } from "@/lib/utils";
import Link from "next/link";

const urgencyConfig = {
  CRITICAL: { 
    color: "text-red-600", 
    bg: "bg-red-50 border-red-200", 
    badge: "destructive" as const,
    icon: AlertTriangle 
  },
  HIGH: { 
    color: "text-orange-600", 
    bg: "bg-orange-50 border-orange-200", 
    badge: "default" as const,
    icon: TrendingDown 
  },
  MEDIUM: { 
    color: "text-yellow-600", 
    bg: "bg-yellow-50 border-yellow-200", 
    badge: "secondary" as const,
    icon: Package 
  },
};

function StockAlertCard({ alert }: { alert: StockAlert }) {
  const config = urgencyConfig[alert.urgency];
  const Icon = config.icon;
  const location = alert.store?.name || alert.warehouse?.name || "Localisation inconnue";

  return (
    <Card className={cn("transition-all hover:shadow-md", config.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white">
            <Icon className={cn("h-5 w-5", config.color)} />
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
              
              <Progress 
                value={alert.percentageLeft} 
                className="h-2"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {alert.percentageLeft.toFixed(1)}% du seuil minimum
                </span>
                <span className="text-sm font-medium">
                  {alert.product.unitPrice.toLocaleString()} FCFA/unité
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StockAlertsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: alerts, isLoading, error } = useStockAlerts(organizationId);

  if (isLoading) return <PageLoader text="Chargement des alertes..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const criticalCount = alerts?.filter(a => a.urgency === 'CRITICAL').length || 0;
  const highCount = alerts?.filter(a => a.urgency === 'HIGH').length || 0;
  const totalValue = alerts?.reduce((sum, alert) => 
    sum + (alert.product.unitPrice * alert.quantity), 0) || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            Alertes Stock
          </h1>
          <p className="text-muted-foreground">
            Produits nécessitant un réapprovisionnement urgent
          </p>
        </div>
        
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/stock-transfers`}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Gérer les transferts
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Produits concernés</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Stock épuisé</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            <p className="text-xs text-muted-foreground">Stock très bas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valeur impactée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Stock restant</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          <>
            {criticalCount > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes critiques ({criticalCount})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {alerts
                    .filter(alert => alert.urgency === 'CRITICAL')
                    .map(alert => (
                      <StockAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
              </div>
            )}

            {highCount > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Alertes urgentes ({highCount})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {alerts
                    .filter(alert => alert.urgency === 'HIGH')
                    .map(alert => (
                      <StockAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
              </div>
            )}

            {alerts.filter(alert => alert.urgency === 'MEDIUM').length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Alertes modérées
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {alerts
                    .filter(alert => alert.urgency === 'MEDIUM')
                    .map(alert => (
                      <StockAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-green-600">Aucune alerte !</h3>
              <p className="text-muted-foreground text-center">
                Excellent ! Tous vos produits ont un stock suffisant.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}