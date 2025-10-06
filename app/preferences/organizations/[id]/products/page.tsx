"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { ProductsStats } from "@/components/organisms/products/ProductsStats";
import { ProductsTable } from "@/components/organisms/products/ProductsTable";

export default function ProductsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const { data: products = [], isLoading } = useProducts(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-80 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">Gérez le catalogue de produits de votre organisation</p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/products/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <ProductsStats products={products} />
      <ProductsTable products={products} organizationId={organizationId} isLoading={isLoading} />
    </div>
  );
}
