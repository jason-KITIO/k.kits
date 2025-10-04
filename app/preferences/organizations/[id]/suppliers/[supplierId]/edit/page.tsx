"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Building } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierCreateSchema, type SupplierCreateInput } from "@/schema/supplier.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSuppliers, useUpdateSupplier } from "@/hooks/useSuppliers";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function EditSupplierPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const supplierId = params.supplierId as string;
  
  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);
  const updateSupplier = useUpdateSupplier(organizationId);
  const supplier = suppliers.find(s => s.id === supplierId);

  const form = useForm<SupplierCreateInput>({
    resolver: zodResolver(supplierCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      contactPerson: "",
      taxNumber: "",
      paymentTerms: "",
      notes: "",
      active: true,
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name,
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        contactPerson: supplier.contactPerson || "",
        taxNumber: supplier.taxNumber || "",
        paymentTerms: supplier.paymentTerms || "",
        notes: supplier.notes || "",
        active: supplier.active,
      });
    }
  }, [supplier, form]);

  const handleSubmit = async (data: SupplierCreateInput) => {
    await updateSupplier.mutateAsync({ id: supplierId, data });
    router.push(`/preferences/organizations/${organizationId}/suppliers/${supplierId}`);
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
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    );
  }
  if (!supplier) return <div>Fournisseur non trouvé</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/suppliers/${supplierId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier {supplier.name}</h1>
          <p className="text-muted-foreground">
            Mettre à jour les informations du fournisseur
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du fournisseur *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Entreprise ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personne de contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@entreprise.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+237 698 765 432" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Adresse complète du fournisseur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations commerciales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro fiscal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: FR12345678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conditions de paiement</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 30 jours net" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes additionnelles</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Informations complémentaires sur le fournisseur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Fournisseur actif</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={updateSupplier.isPending}>
              {updateSupplier.isPending ? "Mise à jour..." : "Mettre à jour"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/preferences/organizations/${organizationId}/suppliers/${supplierId}`}>
                Annuler
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}