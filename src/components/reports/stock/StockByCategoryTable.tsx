"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Currency } from "../shared/CurrencyFormatter";

interface CategoryStock {
  categoryId: string;
  categoryName: string;
  totalQuantity: number;
  totalValue: number;
}

interface StockByCategoryTableProps {
  categories: CategoryStock[];
  totalStockValue: number;
}

export function StockByCategoryTable({ categories, totalStockValue }: StockByCategoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Quantité totale</TableHead>
              <TableHead className="text-right">Valeur</TableHead>
              <TableHead className="text-right">% du stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell className="font-medium">{category.categoryName}</TableCell>
                <TableCell className="text-right">{category.totalQuantity}</TableCell>
                <TableCell className="text-right">
                  <Currency amount={category.totalValue} />
                </TableCell>
                <TableCell className="text-right">
                  {totalStockValue > 0 
                    ? ((category.totalValue / totalStockValue) * 100).toFixed(1)
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
