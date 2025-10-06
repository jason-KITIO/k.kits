"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Period {
  period: string;
  movements: number;
  quantity: number;
}

interface MovementEvolutionTableProps {
  periods: Period[];
}

export function MovementEvolutionTable({ periods }: MovementEvolutionTableProps) {
  if (periods.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des mouvements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              <TableHead className="text-right">Mouvements</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Évolution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period, index) => {
              const previousPeriod = periods[index - 1];
              const evolution = previousPeriod
                ? ((period.movements - previousPeriod.movements) / previousPeriod.movements) * 100
                : 0;

              return (
                <TableRow key={period.period}>
                  <TableCell className="font-medium">{period.period}</TableCell>
                  <TableCell className="text-right">{period.movements}</TableCell>
                  <TableCell className="text-right">{period.quantity}</TableCell>
                  <TableCell className="text-right">
                    {index > 0 && (
                      <Badge variant={evolution >= 0 ? "default" : "secondary"}>
                        {evolution >= 0 ? "+" : ""}{evolution.toFixed(1)}%
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
