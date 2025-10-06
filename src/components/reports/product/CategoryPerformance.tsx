"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Category {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalRevenue: number;
  averagePrice: number;
}

interface CategoryPerformanceProps {
  categories: Category[];
}

export function CategoryPerformance({ categories }: CategoryPerformanceProps) {
  const maxRevenue = Math.max(...categories.map(c => c.totalRevenue));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance par Catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.categoryId} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{category.categoryName}</p>
                  <p className="text-sm text-muted-foreground">{category.productCount} produits</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{category.totalRevenue.toLocaleString()} €</p>
                <p className="text-sm text-muted-foreground">Prix moyen: {category.averagePrice.toFixed(2)} €</p>
              </div>
              <div className="w-24">
                <Progress value={(category.totalRevenue / maxRevenue) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
