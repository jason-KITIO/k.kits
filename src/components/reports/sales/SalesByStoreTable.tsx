"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Currency } from "../shared/CurrencyFormatter";

interface StoreData {
  storeId: string;
  storeName: string;
  sales: number;
  revenue: number;
}

interface SalesByStoreTableProps {
  stores: StoreData[];
}

export function SalesByStoreTable({ stores }: SalesByStoreTableProps) {
  if (stores.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes par boutique</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boutique</TableHead>
              <TableHead className="text-right">Ventes</TableHead>
              <TableHead className="text-right">Chiffre d'affaires</TableHead>
              <TableHead className="text-right">Panier moyen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.storeId}>
                <TableCell className="font-medium">{store.storeName}</TableCell>
                <TableCell className="text-right">{store.sales}</TableCell>
                <TableCell className="text-right">
                  <Currency amount={store.revenue} />
                </TableCell>
                <TableCell className="text-right">
                  <Currency amount={store.sales > 0 ? store.revenue / store.sales : 0} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
