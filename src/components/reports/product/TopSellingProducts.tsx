"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Product {
  productId: string;
  productName: string;
  sku: string;
  category?: string;
  quantitySold: number;
  revenue: number;
}

interface TopSellingProductsProps {
  products: Product[];
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Top Produits Vendeurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 10).map((product, index) => (
            <div key={product.productId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {index + 1}
                </Badge>
                <div>
                  <p className="font-medium text-sm">{product.productName}</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  {product.category && (
                    <Badge variant="outline" className="text-xs mt-1">{product.category}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{product.quantitySold} vendus</p>
                <p className="text-sm text-muted-foreground">{product.revenue.toLocaleString()} €</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
