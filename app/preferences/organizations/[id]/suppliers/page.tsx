"use client";

import { useParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useSupplierColumns } from "@/hooks/features/suppliers/useSupplierColumns";
import { SupplierStats } from "@/components/pages/suppliers/SupplierStats";
import { SupplierLoadingSkeleton } from "@/components/pages/suppliers/SupplierLoadingSkeleton";

export default function SuppliersPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);
  const columns = useSupplierColumns(organizationId);

  if (isLoading) return <SupplierLoadingSkeleton />;

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.active).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fournisseurs</h1>
          <p className="text-muted-foreground">Gérez vos partenaires commerciaux</p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/suppliers/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau fournisseur
          </Link>
        </Button>
      </div>

      <SupplierStats total={totalSuppliers} active={activeSuppliers} />

      <Card>
        <CardHeader>
          <CardTitle>Liste des fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={suppliers}
            searchKey="name"
            searchPlaceholder="Rechercher un fournisseur..."
            isLoading={isLoading}
            emptyMessage="Aucun fournisseur trouvé"
          />
        </CardContent>
      </Card>
    </div>
  );
}