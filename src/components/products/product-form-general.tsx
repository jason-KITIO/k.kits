"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Control } from "react-hook-form";

interface ProductFormGeneralProps {
  control: Control<any>;
  categories: any[];
  suppliers: any[];
  warehouses: any[];
  categoriesLoading: boolean;
  suppliersLoading: boolean;
  warehousesLoading: boolean;
}

export function ProductFormGeneral({ control, categories, suppliers, warehouses, categoriesLoading, suppliersLoading, warehousesLoading }: ProductFormGeneralProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du produit *</FormLabel>
            <FormControl><Input placeholder="Ex: T-shirt blanc" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField control={control} name="categoryId" render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger disabled={categoriesLoading}>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? <SelectItem value="loading" disabled>Chargement...</SelectItem> : categories.length === 0 ? <SelectItem value="empty" disabled>Aucune catégorie disponible</SelectItem> : categories.filter((c) => c.active).map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="supplierId" render={({ field }) => (
            <FormItem>
              <FormLabel>Fournisseur</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger disabled={suppliersLoading}>
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliersLoading ? <SelectItem value="loading" disabled>Chargement...</SelectItem> : suppliers.length === 0 ? <SelectItem value="empty" disabled>Aucun fournisseur disponible</SelectItem> : suppliers.filter((s) => s.active).map((supplier) => (
                    <SelectItem key={supplier.id} value={String(supplier.id)}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="warehouseId" render={({ field }) => (
            <FormItem>
              <FormLabel>Entrepôt</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger disabled={warehousesLoading}>
                    <SelectValue placeholder="Sélectionner un entrepôt" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehousesLoading ? <SelectItem value="loading" disabled>Chargement...</SelectItem> : warehouses.length === 0 ? <SelectItem value="empty" disabled>Aucun entrepôt disponible</SelectItem> : warehouses.filter((w) => w.active).map((warehouse) => (
                    <SelectItem key={warehouse.id} value={String(warehouse.id)}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="Description détaillée du produit" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={control} name="color" render={({ field }) => (
          <FormItem>
            <FormLabel>Couleur</FormLabel>
            <FormControl><Input placeholder="Ex: Rouge, Bleu, #FF0000" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </CardContent>
    </Card>
  );
}
