"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductModal } from "@/components/products/product-modal";
import { DeleteProductModal } from "@/components/products/delete-product-modal";
import { Product, CreateProductData, UpdateProductData } from "@/types/product";
import Link from "next/link";

export default function ProductsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: products, isLoading } = useProducts(organizationId);
  const createProduct = useCreateProduct(organizationId);
  const updateProduct = useUpdateProduct(organizationId);
  const deleteProduct = useDeleteProduct(organizationId);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const handleCreate = (data: CreateProductData) => {
    createProduct.mutate(data, {
      onSuccess: () => setCreateModalOpen(false),
    });
  };

  const handleEdit = (data: UpdateProductData) => {
    if (!selectedProduct) return;
    updateProduct.mutate(
      { id: selectedProduct.id, data },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedProduct(undefined);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    deleteProduct.mutate(selectedProduct.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedProduct(undefined);
      },
    });
  };

  if (isLoading) return <div className="p-6">Chargement des produits...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes produits</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{product.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Prix: {product.unitPrice || 0} FCFA</span>
                    <span>Stock min: {product.minStock}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        href={`/organizations/${organizationId}/products/${product.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun produit</h3>
          <p className="text-muted-foreground mb-4">
            Vous n&apos;avez pas encore créé de produits.
          </p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier produit
          </Button>
        </div>
      )}

      <ProductModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreate}
        isLoading={createProduct.isPending}
      />

      <ProductModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={selectedProduct}
        onSubmit={handleEdit}
        isLoading={updateProduct.isPending}
      />

      <DeleteProductModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        product={selectedProduct}
        onConfirm={handleDelete}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
