import { StatCard } from "@/components/atoms";
import { AlertTriangle, Package, TrendingUp, DollarSign } from "lucide-react";

interface MetricsGridProps {
  lowStockCount: number;
  lowStockPercentage: number;
  totalStores: number;
  todayCount: number;
  todaySales: number;
  totalValue: number;
  totalProducts: number;
}

export function MetricsGrid({
  lowStockCount,
  lowStockPercentage,
  totalStores,
  todayCount,
  todaySales,
  totalValue,
  totalProducts,
}: MetricsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Stock faible"
        value={lowStockCount}
        subtitle="Produits concernés"
        icon={AlertTriangle}
        iconColor="text-destructive"
        iconBgColor="bg-destructive/10"
        borderColor="border-l-destructive"
        valueColor="text-destructive"
        badge={totalProducts > 0 ? { text: `${lowStockPercentage.toFixed(1)}%`, variant: "destructive" } : undefined}
      />
      
      <StatCard
        title="Boutiques"
        value={totalStores}
        subtitle="Points de vente"
        icon={Package}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        borderColor="border-l-blue-500"
        valueColor="text-blue-600"
      />
      
      <StatCard
        title="Ventes aujourd'hui"
        value={todayCount}
        subtitle={`${todaySales.toLocaleString()} FCFA`}
        icon={TrendingUp}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
        borderColor="border-l-green-500"
        valueColor="text-green-600"
      />
      
      <StatCard
        title="Valeur du stock"
        value={`${totalValue.toLocaleString()} FCFA`}
        subtitle="Valeur totale estimée"
        icon={DollarSign}
        iconColor="text-amber-500"
        iconBgColor="bg-amber-500/10"
        borderColor="border-l-amber-500"
        valueColor="text-amber-600"
      />
    </div>
  );
}
