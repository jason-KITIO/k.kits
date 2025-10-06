import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ReportKPICard } from "../shared/ReportKPICard";
import { ProfitMarginBadge, getMarginColor } from "../shared/ProfitMarginBadge";
import { formatCurrency } from "../shared/CurrencyFormatter";

interface ProfitKPIsProps {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
}

export function ProfitKPIs({ totalRevenue, totalCost, grossProfit, profitMargin }: ProfitKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ReportKPICard title="Chiffre d'affaires" value={formatCurrency(totalRevenue)} subtitle="Revenue total" icon={DollarSign} />
      <ReportKPICard title="Coûts totaux" value={formatCurrency(totalCost)} subtitle="Coût de revient" icon={TrendingDown} iconColor="text-red-500" valueColor="text-red-600" />
      <ReportKPICard title="Bénéfice brut" value={formatCurrency(grossProfit)} subtitle="Profit net" icon={TrendingUp} iconColor="text-green-500" valueColor="text-green-600" />
      <div className="space-y-2">
        <ReportKPICard title="Marge globale" value={`${profitMargin.toFixed(1)}%`} icon={Target} valueColor={getMarginColor(profitMargin)} />
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <Progress value={Math.min(profitMargin, 100)} className="flex-1 h-2" />
            <ProfitMarginBadge margin={profitMargin} />
          </div>
        </div>
      </div>
    </div>
  );
}
