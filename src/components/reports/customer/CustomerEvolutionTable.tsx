"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CustomerPeriod {
  period: string;
  newCustomers: number;
  totalCustomers: number;
}

interface CustomerEvolutionTableProps {
  periods: CustomerPeriod[];
}

export function CustomerEvolutionTable({ periods }: CustomerEvolutionTableProps) {
  if (periods.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de la clientèle</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              <TableHead className="text-right">Nouveaux clients</TableHead>
              <TableHead className="text-right">Total clients</TableHead>
              <TableHead className="text-right">Croissance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period, index) => {
              const previousPeriod = periods[index - 1];
              const growth = previousPeriod
                ? ((period.newCustomers - previousPeriod.newCustomers) / previousPeriod.newCustomers) * 100
                : 0;

              return (
                <TableRow key={period.period}>
                  <TableCell className="font-medium">{period.period}</TableCell>
                  <TableCell className="text-right text-green-600">+{period.newCustomers}</TableCell>
                  <TableCell className="text-right">{period.totalCustomers}</TableCell>
                  <TableCell className="text-right">
                    {index > 0 && (
                      <Badge variant={growth >= 0 ? "default" : "destructive"}>
                        {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
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
  );
}
