"use client";

import { useParams, useRouter } from "next/navigation";
import { useWarehouse, useUpdateWarehouse, useDeleteWarehouse } from "@/hooks/use-warehouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { warehouseUpdateSchema, type WarehouseUpdateInput } from "@/schema/warehouse.schema";

type WarehouseFormData = WarehouseUpdateInput;

export default function EditWarehousePage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const warehouseId = params.warehouseId as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: warehouse, isLoading } = useWarehouse(organizationId, warehouseId);
  const updateWarehouse = useUpdateWarehouse(organizationId);
  const deleteWarehouse = useDeleteWarehouse(organizationId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseUpdateSchema),
  });

  if (warehouse && !watch("name")) {
    setValue("name", warehouse.name);
    setValue("type", warehouse.type);
    setValue("address", warehouse.address || undefined);
    setValue("phone", warehouse.phone || undefined);
    setValue("capacity", warehouse.capacity || undefined);
    setValue("active", warehouse.active);
    setValue("managerId", warehouse.managerId || undefined);
  }

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      await updateWarehouse.mutateAsync({ warehouseId, data });
      router.push(`/preferences/organizations/${organizationId}/warehouses/${warehouseId}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouse.mutateAsync({ warehouseId, forceDelete: true });
      router.push(`/preferences/organizations/${organizationId}/warehouses`);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!warehouse) {
    return <div className="p-6">Entrepôt non trouvé</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Modifier l'entrepôt</h1>
            <p className="text-muted-foreground">{warehouse.name}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={deleteWarehouse.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'entrepôt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Nom de l'entrepôt"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={watch("type")}
                  onValueChange={(value) => setValue("type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAIN">Principal</SelectItem>
                    <SelectItem value="SECONDARY">Secondaire</SelectItem>
                    <SelectItem value="TRANSIT">Transit</SelectItem>
                    <SelectItem value="RETURNS">Retours</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Numéro de téléphone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register("capacity", { valueAsNumber: true })}
                  placeholder="Capacité de stockage"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Adresse complète"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={updateWarehouse.isPending}
              >
                {updateWarehouse.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}`}>
                  Annuler
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'entrepôt</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'entrepôt "{warehouse.name}" ?
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteWarehouse.isPending}
            >
              {deleteWarehouse.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}