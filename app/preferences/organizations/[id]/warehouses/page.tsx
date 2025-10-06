"use client";

import { useParams } from "next/navigation";
import { useWarehouses } from "@/hooks/use-warehouses";
import { CreateWarehouseDialog } from "@/components/warehouses/create-warehouse-dialog";
import { DeleteWarehouseDialog } from "@/components/warehouses/delete-warehouse-dialog";
import { WarehouseHeader } from "@/components/pages/warehouses/WarehouseHeader";
import { WarehouseCard } from "@/components/pages/warehouses/WarehouseCard";
import { WarehouseEmptyState } from "@/components/pages/warehouses/WarehouseEmptyState";
import { useState } from "react";

export default function WarehousesPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: warehouses, isLoading } = useWarehouses(organizationId);

  const handleDeleteClick = (warehouseId: string, warehouseName: string) => {
    setWarehouseToDelete({ id: warehouseId, name: warehouseName });
    setDeleteDialogOpen(true);
  };

  if (isLoading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      <WarehouseHeader organizationId={organizationId} onCreateClick={() => setCreateDialogOpen(true)} />

      {warehouses?.length === 0 ? (
        <WarehouseEmptyState organizationId={organizationId} onCreateClick={() => setCreateDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses?.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              organizationId={organizationId}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <CreateWarehouseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        organizationId={organizationId}
      />

      <DeleteWarehouseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        warehouseId={warehouseToDelete?.id || ''}
        warehouseName={warehouseToDelete?.name || ''}
        organizationId={organizationId}
        onSuccess={() => {
          setWarehouseToDelete(null);
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}