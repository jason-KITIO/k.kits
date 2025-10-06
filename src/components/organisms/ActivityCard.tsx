import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Eye, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  product: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ActivityCardProps {
  organizationId: string;
  recentActivity: Activity[] | undefined;
}

export function ActivityCard({ organizationId, recentActivity }: ActivityCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            Activité récente
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Derniers mouvements de stock
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores`}>
            <Eye className="h-4 w-4 mr-2" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} - {item.quantity > 0 ? '+' : ''}{item.quantity}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.user.firstName} {item.user.lastName}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/organizations/${organizationId}/stock-movements`}>
                    Voir {recentActivity.length - 5} autres mouvements
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Aucune activité récente</p>
            <Button size="sm" asChild className="mt-2">
              <Link href={`/organizations/${organizationId}/products`}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier produit
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
