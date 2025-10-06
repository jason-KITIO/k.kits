"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productEditSchema, type productEditInput } from "@/schema/product.schema";
import { Form } from "@/components/ui/form";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { ProductFormGeneral } from "@/components/products/product-form-general";
import { ProductFormPricing } from "@/components/products/product-form-pricing";
import { ProductFormEdit } from "@/components/products/product-form-edit";
import { PageHeader } from "@/components/shared/page-header";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const productId = params.productId as string;
  
  const { data: products = [], isLoading } = useProducts(organizationId);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(organizationId);
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers(organizationId);
  const product = products.find(p => p.id === productId);
  
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<productEditInput>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: "",
      color: "",
      description: "",
      categoryId: "",
      supplierId: "",
      unitPrice: 0,
      costPrice: 0,
      weight: 0,
      dimensions: "",
      minStock: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        color: product.color,
        description: product.description || "",
        categoryId: product.category?.id || "",
        supplierId: product.supplier?.id || "",
        unitPrice: Number(product.unitPrice),
        costPrice: Number(product.costPrice),
        weight: Number(product.weight) || 0,
        dimensions: product.dimensions || "",
        minStock: Number(product.minStock),
        active: product.active,
      });
    }
  }, [product, form]);

  const handleSubmit = async (data: productEditInput) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/organization/${organizationId}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }
      
      toast.success("Produit mis à jour avec succès");
      router.push(`/preferences/organizations/${organizationId}/products/${productId}`);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du produit");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80 mt-2" />
          </div>
        </div>
        
        <div className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title={`Modifier ${product.name}`}
        description="Mettre à jour les informations du produit"
        backUrl={`/preferences/organizations/${organizationId}/products/${productId}`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-4xl">
          <ProductFormGeneral
            control={form.control}
            categories={categories}
            suppliers={suppliers}
            warehouses={[]}
            categoriesLoading={categoriesLoading}
            suppliersLoading={suppliersLoading}
            warehousesLoading={false}
          />
          <ProductFormPricing control={form.control} />
          <ProductFormEdit control={form.control} />

          <div className="flex gap-2">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Mise à jour..." : "Mettre à jour"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/preferences/organizations/${organizationId}/products/${productId}`}>
                Annuler
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}