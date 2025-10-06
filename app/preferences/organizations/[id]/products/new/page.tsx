"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema, type productCreateInput } from "@/schema/product.schema";
import { Form } from "@/components/ui/form";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useWarehouses } from "@/hooks/useWarehouses";
import { ProductFormGeneral } from "@/components/products/product-form-general";
import { ProductFormPricing } from "@/components/products/product-form-pricing";
import { ProductFormStock } from "@/components/products/product-form-stock";

export default function NewProductPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
      unitPrice: 0,
      costPrice: 0,
      weight: 0,
      dimensions: "",
      active: true,
      initialStock: 0,
      categoryId: "",
      supplierId: "",
      warehouseId: "",
    },
  });

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories(organizationId);
  const { data: suppliers = [], isLoading: suppliersLoading, error: suppliersError } = useSuppliers(organizationId);
  const { data: warehouses = [], isLoading: warehousesLoading, error: warehousesError } = useWarehouses(organizationId);

  const handleSubmit: SubmitHandler<productCreateInput> = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/organization/${organizationId}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      toast.success("Produit créé avec succès");
      router.push(`/preferences/organizations/${organizationId}/products`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du produit";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const backPath = `/preferences/organizations/${organizationId}/products`;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau produit</h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau produit au catalogue
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ProductFormGeneral
            control={form.control}
            categories={categories}
            suppliers={suppliers}
            warehouses={warehouses}
            categoriesLoading={categoriesLoading}
            suppliersLoading={suppliersLoading}
            warehousesLoading={warehousesLoading}
          />
          <ProductFormPricing control={form.control} />
          <ProductFormStock control={form.control} />

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer le produit"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={backPath}>Annuler</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
