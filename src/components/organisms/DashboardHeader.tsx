import { Button } from "@/components/ui/button";
import { Settings, BarChart3, Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  organizationId: string;
}

export function DashboardHeader({ organizationId }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre inventaire et métriques clés
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/preferences">
            <Settings className="h-4 w-4 mr-2" />
            Préférences
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/organizations/${organizationId}/reports/stock`}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapports
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/organizations/${organizationId}/products`}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter produit
          </Link>
        </Button>
      </div>
    </div>
  );
}
