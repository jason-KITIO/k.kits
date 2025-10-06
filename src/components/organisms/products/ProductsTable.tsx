"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { getProductsColumns } from "@/lib/table-columns/products-columns";
import { Product } from "@/hooks/useProducts";

export function ProductsTable({ products, organizationId, isLoading }: { products: Product[]; organizationId: string; isLoading: boolean }) {
  const columns = getProductsColumns(organizationId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des produits</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Rechercher un produit..."
          isLoading={isLoading}
          emptyMessage="Aucun produit trouvé"
        />
      </CardContent>
    </Card>
  );
}
