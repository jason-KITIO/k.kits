"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/use-products";
import { Search, Package, Barcode } from "lucide-react";

interface QuickSearchProps {
  organizationId: string;
}

export function QuickSearch({ organizationId }: QuickSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products = [] } = useProducts(organizationId);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recherche rapide</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Rechercher un produit</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nom du produit ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {searchTerm && (
            <div className="space-y-2">
              {filteredProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun produit trouvé
                </p>
              ) : (
                filteredProducts.slice(0, 10).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Barcode className="h-3 w-3" />
                          <span>{product.sku}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Stock: {product.currentStock || 0}
                      </div>
                      <Badge
                        variant={
                          product.currentStock && product.currentStock > 0
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.currentStock && product.currentStock > 0
                          ? "Disponible"
                          : "Rupture"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
