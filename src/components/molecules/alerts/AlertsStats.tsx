import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  gradient: string;
  textColor: string;
}

function StatsCard({ title, value, subtitle, gradient, textColor }: StatsCardProps) {
  return (
    <Card className={`border-0 ${gradient}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColor.replace('300', '400').replace('700', '600')}`}>
          {value}
        </div>
        <p className={`text-xs ${textColor.replace('300', '400/70').replace('700', '600/70')}`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

interface AlertsStatsProps {
  total: number;
  unread: number;
  urgent: number;
  type?: "notifications" | "stock";
  critical?: number;
  high?: number;
  value?: number;
}

export function AlertsStats({ total, unread, urgent, type = "notifications", critical, high, value }: AlertsStatsProps) {
  if (type === "stock") {
    return (
      <div className="grid gap-6 md:grid-cols-4 flex-1">
        <StatsCard title="Total alertes" value={total} subtitle="Produits concernés" 
          gradient="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20"
          textColor="text-slate-700 dark:text-slate-300" />
        <StatsCard title="Critiques" value={critical || 0} subtitle="Stock épuisé"
          gradient="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20"
          textColor="text-red-700 dark:text-red-300" />
        <StatsCard title="Urgentes" value={high || 0} subtitle="Stock très bas"
          gradient="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20"
          textColor="text-orange-700 dark:text-orange-300" />
        <StatsCard title="Valeur impactée" value={value || 0} subtitle="Stock restant"
          gradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20"
          textColor="text-green-700 dark:text-green-300" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 flex-1">
      <StatsCard title="Total" value={total} subtitle="Notifications"
        gradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"
        textColor="text-blue-700 dark:text-blue-300" />
      <StatsCard title="Non lues" value={unread} subtitle="À traiter"
        gradient="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20"
        textColor="text-amber-700 dark:text-amber-300" />
      <StatsCard title="Urgentes" value={urgent} subtitle="Priorité critique"
        gradient="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20"
        textColor="text-red-700 dark:text-red-300" />
    </div>
  );
}
