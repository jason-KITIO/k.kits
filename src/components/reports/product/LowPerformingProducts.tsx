"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

interface Product {
  productId: string;
  productName: string;
  sku: string;
  stockLevel: number;
  daysSinceLastSale: number;
  quantitySold: number;
}

interface LowPerformingProductsProps {
  products: Product[];
}

export function LowPerformingProducts({ products }: LowPerformingProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          Produits Peu Performants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 10).map((product, index) => (
            <div key={product.productId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {index + 1}
                </Badge>
                <div>
                  <p className="font-medium text-sm">{product.productName}</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">Stock: {product.stockLevel}</Badge>
                    <Badge variant="secondary" className="text-xs">{product.daysSinceLastSale}j sans vente</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">{product.quantitySold} vendus</p>
                <p className="text-xs text-muted-foreground">Faible rotation</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
