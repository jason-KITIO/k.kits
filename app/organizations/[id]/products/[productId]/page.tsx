"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useProduct } from "@/hooks/use-product";
import { useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductModal } from "@/components/products/product-modal";
import { DeleteProductModal } from "@/components/products/delete-product-modal";
import { UpdateProductData } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const productId = params.productId as string;

  const { data: product, isLoading } = useProduct(organizationId, productId);
  const updateProduct = useUpdateProduct(organizationId);
  const deleteProduct = useDeleteProduct(organizationId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEdit = (data: UpdateProductData) => {
    updateProduct.mutate(
      { id: productId, data },
      {
        onSuccess: () => setEditModalOpen(false),
      }
    );
  };

  const handleDelete = () => {
    deleteProduct.mutate(productId, {
      onSuccess: () => router.push(`/organizations/${organizationId}/products`),
    });
  };

  if (isLoading) return <div className="p-6">Chargement du produit...</div>;
  if (!product) return <div className="p-6">Produit non trouvé</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">{product.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom
              </label>
              <p className="text-lg">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                SKU
              </label>
              <p>{product.sku}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p>{product.description || "Aucune description"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Code-barres
              </label>
              <p>{product.barcode || "Aucun"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Unité
              </label>
              <p>{product.unit}</p>
            </div>
            {product.color && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Couleur
                </label>
                <p>{product.color}</p>
              </div>
            )}
            {product.material && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Matière
                </label>
                <p>{product.material}</p>
              </div>
            )}
            {product.size && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Taille
                </label>
                <p>{product.size}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prix et stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Prix unitaire
              </label>
              <p className="text-lg font-semibold">
                {product.unitPrice || 0} FCFA
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Prix de revient
              </label>
              <p>{product.costPrice || 0} FCFA</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Stock minimum
              </label>
              <p>{product.minStock}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Stock maximum
              </label>
              <p>{product.maxStock || "Non défini"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Statut
              </label>
              <p className={product.active ? "text-green-600" : "text-red-600"}>
                {product.active ? "Actif" : "Inactif"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProductModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={product}
        onSubmit={handleEdit}
        isLoading={updateProduct.isPending}
      />

      <DeleteProductModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        product={product}
        onConfirm={handleDelete}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
