import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/hooks/useProducts";

export function ProductsStats({ products }: { products: Product[] }) {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const totalValue = products.reduce((sum, p) => sum + (p.unitPrice * 1), 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Articles au catalogue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
          <p className="text-xs text-muted-foreground">Produits actifs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{totalProducts - activeProducts}</div>
          <p className="text-xs text-muted-foreground">Produits inactifs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(avgPrice)}
          </div>
          <p className="text-xs text-muted-foreground">Prix de vente moyen</p>
        </CardContent>
      </Card>
    </div>
  );
}
