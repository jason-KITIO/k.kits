import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProfitMarginBadge, getMarginColor } from "../shared/ProfitMarginBadge";
import { formatCurrency } from "../shared/CurrencyFormatter";

interface ProductProfit {
  productId: string;
  productName: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

interface ProfitByProductTableProps {
  products: ProductProfit[];
}

export function ProfitByProductTable({ products }: ProfitByProductTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rentabilité par produit</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">CA</TableHead>
              <TableHead className="text-right">Coût</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead className="text-right">Marge</TableHead>
              <TableHead className="text-right">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 15).map((product, index) => (
              <TableRow key={product.productId}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    {product.productName}
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(product.cost)}</TableCell>
                <TableCell className="text-right">
                  <span className={product.profit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(product.profit)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={getMarginColor(product.margin)}>{product.margin.toFixed(1)}%</span>
                </TableCell>
                <TableCell className="text-right">
                  <ProfitMarginBadge margin={product.margin} showProgress />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
