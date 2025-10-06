import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Eye, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StockAlert {
  productId: string;
  quantity: number;
  product: {
    name: string;
    sku: string;
    minStock: number;
  };
}

interface AlertsCardProps {
  organizationId: string;
  stockAlerts: StockAlert[] | undefined;
}

export function AlertsCard({ organizationId, stockAlerts }: AlertsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Alertes stock faible
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Produits nécessitant un réapprovisionnement
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stock-alerts`}>
            <Eye className="h-4 w-4 mr-2" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {stockAlerts && stockAlerts.length > 0 ? (
          <div className="space-y-4">
            {stockAlerts.slice(0, 5).map((item) => {
              const stockPercentage =
                item.product.minStock > 0
                  ? (item.quantity / item.product.minStock) * 100
                  : 0;
              return (
                <div key={item.productId} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.sku}</p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="destructive" className="text-xs">
                        {item.quantity} / {item.product.minStock}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={Math.min(stockPercentage, 100)} className="h-2" />
                </div>
              );
            })}
            {stockAlerts.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/organizations/${organizationId}/alerts/low-stock`}>
                    Voir {stockAlerts.length - 5} autres produits
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Aucun produit en stock faible</p>
            <p className="text-sm text-muted-foreground">Excellent ! Votre stock est bien géré</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
