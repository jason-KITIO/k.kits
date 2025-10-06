"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Period {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueEvolutionProps {
  periods: Period[];
}

export function RevenueEvolution({ periods }: RevenueEvolutionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution Financière par Période</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {periods.map((period, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{period.period}</Badge>
                <div>
                  <p className="font-medium">Revenus: {period.revenue.toLocaleString()} €</p>
                  <p className="text-sm text-muted-foreground">Dépenses: {period.expenses.toLocaleString()} €</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${period.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {period.profit >= 0 ? '+' : ''}{period.profit.toLocaleString()} €
                </p>
                <p className="text-sm text-muted-foreground">{period.profit >= 0 ? 'Bénéfice' : 'Perte'}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
