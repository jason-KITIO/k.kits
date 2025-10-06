"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Currency } from "../shared/CurrencyFormatter";

interface LocationStock {
  locationId: string;
  locationName: string;
  locationType: "store" | "warehouse";
  totalQuantity: number;
  totalValue: number;
}

interface StockByLocationTableProps {
  locations: LocationStock[];
  totalStockValue: number;
}

export function StockByLocationTable({ locations, totalStockValue }: StockByLocationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock par localisation</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Localisation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantité totale</TableHead>
              <TableHead className="text-right">Valeur</TableHead>
              <TableHead className="text-right">% du stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.locationId}>
                <TableCell className="font-medium">{location.locationName}</TableCell>
                <TableCell>
                  <Badge variant={location.locationType === "store" ? "default" : "secondary"}>
                    {location.locationType === "store" ? "Boutique" : "Entrepôt"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{location.totalQuantity}</TableCell>
                <TableCell className="text-right">
                  <Currency amount={location.totalValue} />
                </TableCell>
                <TableCell className="text-right">
                  {totalStockValue > 0 
                    ? ((location.totalValue / totalStockValue) * 100).toFixed(1)
                    : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
