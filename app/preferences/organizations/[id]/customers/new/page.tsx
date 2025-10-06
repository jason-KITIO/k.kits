"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerCreateSchema, type customerCreateInput } from "@/schema/customer.schema";
import { Form } from "@/components/ui/form";
import { CustomerFormFields } from "@/components/pages/customer-form/CustomerFormFields";

export default function NewCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string | undefined;
  
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "INDIVIDUAL" as const,
      active: true,
    },
  });

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        storeId 
          ? `/api/organization/${organizationId}/stores/${storeId}/customer`
          : `/api/organization/${organizationId}/customers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }
      
      toast.success("Client créé avec succès");
      const redirectPath = storeId 
        ? `/preferences/organizations/${organizationId}/stores/${storeId}/customers`
        : `/preferences/organizations/${organizationId}/customers`;
      router.push(redirectPath);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du client");
    } finally {
      setIsLoading(false);
    }
  };

  const backPath = storeId 
    ? `/preferences/organizations/${organizationId}/stores/${storeId}/customers`
    : `/preferences/organizations/${organizationId}/customers`;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau client</h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau client à votre base
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informations du client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <CustomerFormFields form={form} />

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Création..." : "Créer le client"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={backPath}>
                    Annuler
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}