import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProfitMarginBadgeProps {
  margin: number;
  showProgress?: boolean;
}

export function ProfitMarginBadge({ margin, showProgress }: ProfitMarginBadgeProps) {
  const getMarginColor = (m: number) => {
    if (m >= 30) return "text-green-600";
    if (m >= 15) return "text-yellow-600";
    return "text-red-600";
  };

  const getMarginBadge = (m: number) => {
    if (m >= 30) return { variant: "default" as const, label: "Excellente" };
    if (m >= 15) return { variant: "secondary" as const, label: "Correcte" };
    return { variant: "destructive" as const, label: "Faible" };
  };

  const badge = getMarginBadge(margin);

  if (showProgress) {
    return (
      <div className="flex items-center gap-2">
        <Progress value={Math.min(margin, 100)} className="w-16 h-2" />
        <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
      </div>
    );
  }

  return <Badge variant={badge.variant}>{badge.label}</Badge>;
}

export function getMarginColor(margin: number) {
  if (margin >= 30) return "text-green-600";
  if (margin >= 15) return "text-yellow-600";
  return "text-red-600";
}
