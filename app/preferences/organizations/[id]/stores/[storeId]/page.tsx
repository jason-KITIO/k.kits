"use client";

import { useParams } from "next/navigation";
import { useStore, useStoreDashboard } from "@/hooks/useStore";
import { PageLoader } from "@/components/ui/loading-spinner";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Plus,
  BarChart3,
  Users,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function StoreDashboardPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const { data: store, isLoading: storeLoading } = useStore(organizationId, storeId);
  const { data: dashboard, isLoading: dashboardLoading } = useStoreDashboard(organizationId, storeId);

  if (storeLoading || dashboardLoading) {
    return <PageLoader text="Chargement du dashboard boutique..." />;
  }

  if (!store) {
    return <div>Boutique introuvable</div>;
  }

  const quickActions = [
    {
      title: "Nouvelle vente",
      description: "Enregistrer une vente",
      icon: ShoppingCart,
      href: `/preferences/organizations/${organizationId}/stores/${storeId}/sales/new`,
      color: "green" as const,
    },
    {
      title: "Gérer produits",
      description: "Catalogue et stock",
      icon: Package,
      href: `/preferences/organizations/${organizationId}/stores/${storeId}/products`,
      color: "blue" as const,
    },
    {
      title: "Ajuster stock",
      description: "Corrections d'inventaire",
      icon: TrendingUp,
      href: `/preferences/organizations/${organizationId}/stores/${storeId}/stock`,
      color: "yellow" as const,
    },
    {
      title: "Clients",
      description: "Base clients",
      icon: Users,
      href: `/preferences/organizations/${organizationId}/stores/${storeId}/customers`,
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* En-tête boutique */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{store.name}</h1>
            <p className="text-muted-foreground">
              {store.address || "Adresse non renseignée"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/settings`}>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/reports`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Rapports
            </Link>
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventes aujourd'hui"
          value={dashboard?.sales.todayCount || 0}
          description="Transactions"
          icon={ShoppingCart}
          color="green"
        />
        
        <StatCard
          title="CA du jour"
          value={`${dashboard?.sales.todayAmount.toLocaleString() || 0} FCFA`}
          description="Chiffre d'affaires"
          icon={DollarSign}
          color="blue"
        />
        
        <StatCard
          title="Produits en stock"
          value={dashboard?.inventory.totalProducts || 0}
          description="Références actives"
          icon={Package}
          color="purple"
        />
        
        <StatCard
          title="Alertes stock"
          value={dashboard?.inventory.lowStockCount || 0}
          description="Produits à réapprovisionner"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted"
              >
                <Link href={action.href}>
                  <action.icon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Ventes & Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/sales`}>
                Historique des ventes
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers`}>
                Gestion clients
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventaire & Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/products`}>
                Catalogue produits
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/stock`}>
                État des stocks
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/stock-transfers`}>
                Transferts de stock
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}