"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWarehouse } from "@/hooks/use-warehouses";
import { warehouseCreateSchema, type WarehouseCreateInput } from "@/schema/warehouse.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { WarehouseFormHeader } from "@/components/pages/warehouse-form/WarehouseFormHeader";
import { WarehouseFormFields } from "@/components/pages/warehouse-form/WarehouseFormFields";

export default function NewWarehousePage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  
  const createWarehouse = useCreateWarehouse(organizationId);

  const form = useForm<WarehouseCreateInput>({
    resolver: zodResolver(warehouseCreateSchema),
    defaultValues: { name: "", type: "MAIN", active: true, address: "", phone: "" },
  });

  const onSubmit = async (data: WarehouseCreateInput) => {
    try {
      await createWarehouse.mutateAsync(data as any);
      router.push(`/preferences/organizations/${organizationId}/warehouses`);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <WarehouseFormHeader organizationId={organizationId} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de l'entrepôt</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <WarehouseFormFields form={form} />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit" disabled={createWarehouse.isPending}>
                  {createWarehouse.isPending ? "Création..." : "Créer l'entrepôt"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}