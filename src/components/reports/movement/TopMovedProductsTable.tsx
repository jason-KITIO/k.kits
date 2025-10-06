"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TopProduct {
  productId: string;
  productName: string;
  movementCount: number;
  totalQuantity: number;
}

interface TopMovedProductsTableProps {
  products: TopProduct[];
}

export function TopMovedProductsTable({ products }: TopMovedProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 des produits les plus déplacés</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Mouvements</TableHead>
              <TableHead className="text-right">Quantité totale</TableHead>
              <TableHead className="text-right">Moyenne par mouvement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 10).map((product, index) => (
              <TableRow key={product.productId}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    {product.productName}
                  </div>
                </TableCell>
                <TableCell className="text-right">{product.movementCount}</TableCell>
                <TableCell className="text-right">{product.totalQuantity}</TableCell>
                <TableCell className="text-right">
                  {product.movementCount > 0 ? (product.totalQuantity / product.movementCount).toFixed(1) : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
