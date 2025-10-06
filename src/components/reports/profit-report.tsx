"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ProfitReport } from "@/schema/report.schema";
import { ProfitKPIs } from "./profit/ProfitKPIs";
import { ProfitByProductTable } from "./profit/ProfitByProductTable";
import { ProfitTopProducts } from "./profit/ProfitTopProducts";
import { formatCurrency } from "./shared/CurrencyFormatter";
import { getMarginColor } from "./shared/ProfitMarginBadge";

interface ProfitReportProps {
  data: ProfitReport;
  isLoading?: boolean;
}

export function ProfitReportComponent({ data, isLoading }: ProfitReportProps) {
  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <ProfitKPIs
        totalRevenue={data.totalRevenue}
        totalCost={data.totalCost}
        grossProfit={data.grossProfit}
        profitMargin={data.profitMargin}
      />
      <ProfitByProductTable products={data.profitByProduct} />

      {/* Évolution de la rentabilité */}
      {data.profitByPeriod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la rentabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">CA</TableHead>
                  <TableHead className="text-right">Coût</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Marge</TableHead>
                  <TableHead className="text-right">Évolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.profitByPeriod.map((period, index) => {
                  const margin = period.revenue > 0 ? (period.profit / period.revenue) * 100 : 0;
                  const previousPeriod = data.profitByPeriod[index - 1];
                  const previousMargin = previousPeriod && previousPeriod.revenue > 0 
                    ? (previousPeriod.profit / previousPeriod.revenue) * 100 
                    : 0;
                  const marginEvolution = index > 0 ? margin - previousMargin : 0;
                  
                  return (
                    <TableRow key={period.period}>
                      <TableCell className="font-medium">{period.period}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(period.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(period.cost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={period.profit >= 0 ? "text-green-600" : "text-red-600"}>
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XAF'
                          }).format(period.profit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={getMarginColor(margin)}>
                          {margin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {index > 0 && (
                          <Badge variant={marginEvolution >= 0 ? "default" : "destructive"}>
                            {marginEvolution >= 0 ? "+" : ""}{marginEvolution.toFixed(1)}%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ProfitTopProducts products={data.profitByProduct} title="Top 5 - Produits les plus rentables" type="best" />
        <ProfitTopProducts products={data.profitByProduct} title="Produits à optimiser" type="worst" />
      </div>
    </div>
  );
}