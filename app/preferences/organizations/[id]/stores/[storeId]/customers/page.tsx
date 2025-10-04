"use client";

import { useParams } from "next/navigation";
import { useStoreCustomers } from "@/hooks/useStore";
import { TableSkeleton } from "@/components/ui/skeletons";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, ArrowLeft } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import Link from "next/link";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { useDeleteCustomer } from "@/hooks/useStore";
import { toast } from "sonner";

const customerTypeConfig = {
  INDIVIDUAL: { label: "Particulier", color: "bg-blue-100 text-blue-800" },
  COMPANY: { label: "Entreprise", color: "bg-green-100 text-green-800" },
  VIP: { label: "VIP", color: "bg-purple-100 text-purple-800" },
};

function CustomerActions({ customer, organizationId, storeId }: { customer: Customer; organizationId: string; storeId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteCustomer = useDeleteCustomer(organizationId, storeId);

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customer.id);
      toast.success("Client supprimé avec succès");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression du client");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers/${customer.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {customer.name} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const createColumns = (organizationId: string, storeId: string): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") || "Non renseigné",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => row.getValue("phone") || "Non renseigné",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof customerTypeConfig;
      const config = customerTypeConfig[type];
      return <Badge className={config.color}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CustomerActions
        customer={row.original}
        organizationId={organizationId}
        storeId={storeId}
      />
    ),
  },
];

export default function CustomersPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const {
    data: customers,
    isLoading,
    error,
  } = useStoreCustomers(organizationId, storeId);

  if (isLoading) return <TableSkeleton rows={6} cols={6} />;
  if (error) return <div>Erreur: {error.message}</div>;

  const totalCustomers = customers?.length || 0;
  const individualCustomers =
    customers?.filter((c) => c.type === "INDIVIDUAL").length || 0;
  const companyCustomers =
    customers?.filter((c) => c.type === "COMPANY").length || 0;
  const vipCustomers = customers?.filter((c) => c.type === "VIP").length || 0;

  const columns = createColumns(organizationId, storeId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/preferences/organizations/${organizationId}/stores/${storeId}`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Base clients</h1>
            <p className="text-muted-foreground">
              Gérez vos clients et leurs informations
            </p>
          </div>
        </div>
        <Button asChild>
          <Link
            href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers/new`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Clients enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Particuliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {individualCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Clients individuels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {companyCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              Clients professionnels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {vipCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Clients privilégiés</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Liste des clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers || []}
            searchKey="name"
            searchPlaceholder="Rechercher un client..."
            isLoading={isLoading}
            emptyMessage="Aucun client trouvé"
          />
        </CardContent>
      </Card>
    </div>
  );
}
