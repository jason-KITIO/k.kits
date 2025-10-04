"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Tag, Building, DollarSign, Weight, Ruler, Calendar } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const productId = params.productId as string;
  
  const { data: products = [], isLoading } = useProducts(organizationId);
  const product = products.find(p => p.id === productId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-5 w-32 mt-2" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/products`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge variant={product.active ? "default" : "secondary"}>
              {product.active ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <p className="text-muted-foreground">SKU: {product.sku}</p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/products/${productId}/edit`}>
            Modifier
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom</label>
              <p className="text-sm">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">SKU</label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{product.sku}</p>
            </div>
            {product.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm whitespace-pre-line">{product.description}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border" style={{ backgroundColor: product.color }}></div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Couleur</label>
                <p className="text-sm">{product.color}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
              <p className="text-sm">{product.category?.name || "Non classé"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fournisseur</label>
              <p className="text-sm">{product.supplier?.name || "Non renseigné"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Prix et coûts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Prix de vente</label>
              <p className="text-lg font-semibold text-green-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                }).format(product.unitPrice)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Prix d'achat</label>
              <p className="text-lg font-semibold text-blue-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                }).format(product.costPrice)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Marge</label>
              <p className="text-lg font-semibold text-orange-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                }).format(product.unitPrice - product.costPrice)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Caractéristiques physiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.weight && (
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poids</label>
                  <p className="text-sm">{product.weight} kg</p>
                </div>
              </div>
            )}
            {product.dimensions && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                <p className="text-sm">{product.dimensions}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Stock minimum</label>
              <p className="text-sm">{product.minStock} unités</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}