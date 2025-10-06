import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "../shared/CurrencyFormatter";

interface ProductProfit {
  productId: string;
  productName: string;
  profit: number;
  margin: number;
}

interface ProfitTopProductsProps {
  products: ProductProfit[];
  title: string;
  type: "best" | "worst";
}

export function ProfitTopProducts({ products, title, type }: ProfitTopProductsProps) {
  const filtered = type === "best" 
    ? products.filter(p => p.profit > 0).slice(0, 5)
    : products.filter(p => p.margin < 15).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filtered.map((product, index) => (
            <div key={product.productId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={type === "best" ? "outline" : "destructive"}>
                  {type === "best" ? `#${index + 1}` : "⚠"}
                </Badge>
                <span className="font-medium">{product.productName}</span>
              </div>
              <div className="text-right">
                <div className={`font-bold ${product.profit >= 0 ? (type === "best" ? "text-green-600" : "text-yellow-600") : "text-red-600"}`}>
                  {formatCurrency(product.profit)}
                </div>
                <div className="text-xs text-muted-foreground">{product.margin.toFixed(1)}% marge</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
