"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Building } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierCreateSchema, type SupplierCreateInput } from "@/schema/supplier.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateSupplier } from "@/hooks/useSuppliers";

export default function NewSupplierPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string | undefined;
  
  const createSupplier = useCreateSupplier(organizationId);

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

  const handleSubmit = async (data: SupplierCreateInput) => {
    await createSupplier.mutateAsync(data);
    const redirectPath = storeId 
      ? `/preferences/organizations/${organizationId}/stores/${storeId}/suppliers`
      : `/preferences/organizations/${organizationId}/suppliers`;
    router.push(redirectPath);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={storeId 
            ? `/preferences/organizations/${organizationId}/stores/${storeId}/suppliers`
            : `/preferences/organizations/${organizationId}/suppliers`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau fournisseur</h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau partenaire commercial
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
            <Button type="submit" disabled={createSupplier.isPending}>
              {createSupplier.isPending ? "Création..." : "Créer le fournisseur"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={storeId 
                ? `/preferences/organizations/${organizationId}/stores/${storeId}/suppliers`
                : `/preferences/organizations/${organizationId}/suppliers`}>
                Annuler
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}