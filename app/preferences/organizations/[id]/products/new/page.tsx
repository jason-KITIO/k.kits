"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productCreateSchema,
  type productCreateInput,
} from "@/schema/product.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useWarehouses } from "@/hooks/useWarehouses";

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

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(organizationId);
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useSuppliers(organizationId);
  const {
    data: warehouses = [],
    isLoading: warehousesLoading,
    error: warehousesError,
  } = useWarehouses(organizationId);

  // Debug: afficher les erreurs dans la console
  if (categoriesError) console.error("Categories error:", categoriesError);
  if (suppliersError) console.error("Suppliers error:", suppliersError);
  if (warehousesError) console.error("Warehouses error:", warehousesError);

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

      {(categoriesError || suppliersError || warehousesError) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium mb-2">
            Erreurs de chargement :
          </h3>
          {categoriesError && (
            <p className="text-red-600 text-sm">
              Catégories: {categoriesError.message}
            </p>
          )}
          {suppliersError && (
            <p className="text-red-600 text-sm">
              Fournisseurs: {suppliersError.message}
            </p>
          )}
          {warehousesError && (
            <p className="text-red-600 text-sm">
              Entrepôts: {warehousesError.message}
            </p>
          )}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: T-shirt blanc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={categoriesLoading || !!categoriesError}
                          >
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Chargement...
                            </SelectItem>
                          ) : categoriesError ? (
                            <SelectItem value="error" disabled>
                              Erreur de chargement
                            </SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Aucune catégorie disponible
                            </SelectItem>
                          ) : (
                            categories
                              .filter((c) => c.active)
                              .map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fournisseur</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={suppliersLoading || !!suppliersError}
                          >
                            <SelectValue placeholder="Sélectionner un fournisseur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliersLoading ? (
                            <SelectItem value="loading" disabled>
                              Chargement...
                            </SelectItem>
                          ) : suppliersError ? (
                            <SelectItem value="error" disabled>
                              Erreur de chargement
                            </SelectItem>
                          ) : suppliers.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Aucun fournisseur disponible
                            </SelectItem>
                          ) : (
                            suppliers
                              .filter((s) => s.active)
                              .map((supplier) => (
                                <SelectItem
                                  key={supplier.id}
                                  value={String(supplier.id)}
                                >
                                  {supplier.name}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entrepôt</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={warehousesLoading || !!warehousesError}
                          >
                            <SelectValue placeholder="Sélectionner un entrepôt" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehousesLoading ? (
                            <SelectItem value="loading" disabled>
                              Chargement...
                            </SelectItem>
                          ) : warehousesError ? (
                            <SelectItem value="error" disabled>
                              Erreur de chargement
                            </SelectItem>
                          ) : warehouses.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Aucun entrepôt disponible
                            </SelectItem>
                          ) : (
                            warehouses
                              .filter((w) => w.active)
                              .map((warehouse) => (
                                <SelectItem
                                  key={warehouse.id}
                                  value={String(warehouse.id)}
                                >
                                  {warehouse.name}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Debug: Affichage des warehouses */}
              <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                categories debug: {JSON.stringify(categories, null, 2)}
              </p>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée du produit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Rouge, Bleu, #FF0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prix et coûts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix de vente (FCFA) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix d'achat (FCFA) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock initial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="initialStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité initiale</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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
