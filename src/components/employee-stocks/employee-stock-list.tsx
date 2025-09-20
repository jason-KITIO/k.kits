"use client";

import { useState } from "react";
import { useEmployeeStocks, useDeleteEmployeeStock } from "@/hooks/use-employee-stocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus } from "lucide-react";
import { CreateEmployeeStockDialog } from "./create-employee-stock-dialog";
import { EditEmployeeStockDialog } from "./edit-employee-stock-dialog";
import type { EmployeeStockWithRelations } from "@/types/employee-stock";

interface EmployeeStockListProps {
  organizationId: string;
  storeId: string;
  employeeId?: string;
}

export function EmployeeStockList({ organizationId, storeId, employeeId }: EmployeeStockListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editStock, setEditStock] = useState<EmployeeStockWithRelations | null>(null);

  const { data: stocks, isLoading } = useEmployeeStocks(organizationId, storeId, employeeId);
  const stocksWithRelations = stocks as EmployeeStockWithRelations[] | undefined;
  const deleteStock = useDeleteEmployeeStock(organizationId, storeId);

  const handleDelete = (stockId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce stock ?")) {
      deleteStock.mutate(stockId);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stocks Employés</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Stock
        </Button>
      </div>

      <div className="grid gap-4">
        {stocksWithRelations?.map((stock) => (
          <Card key={stock.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stock.product.name} - {stock.employee.firstName} {stock.employee.lastName}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditStock(stock as EmployeeStockWithRelations)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(stock.id)}
                  disabled={deleteStock.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">SKU: {stock.product.sku}</p>
                  <p className="text-lg font-semibold">Quantité: {stock.quantity}</p>
                </div>
                <Badge variant={stock.quantity > 0 ? "default" : "destructive"}>
                  {stock.quantity > 0 ? "En stock" : "Épuisé"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateEmployeeStockDialog
        organizationId={organizationId}
        storeId={storeId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {editStock && (
        <EditEmployeeStockDialog
          organizationId={organizationId}
          storeId={storeId}
          stock={editStock}
          open={!!editStock}
          onOpenChange={(open) => !open && setEditStock(null)}
        />
      )}
    </div>
  );
}