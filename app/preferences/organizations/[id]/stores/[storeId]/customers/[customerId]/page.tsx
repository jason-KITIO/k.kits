"use client";

import { useParams, useRouter } from "next/navigation";
import { useStoreCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/useStore";
import { CustomerForm } from "@/components/customers/customer-form";
import { customerCreateInput } from "@/schema/customer.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/skeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  const customerId = params.customerId as string;

  const { data: customer, isLoading, error } = useStoreCustomer(organizationId, storeId, customerId);
  const updateCustomer = useUpdateCustomer(organizationId, storeId);
  const deleteCustomer = useDeleteCustomer(organizationId, storeId);

  const handleSubmit = async (data: customerCreateInput) => {
    try {
      await updateCustomer.mutateAsync({ customerId, data });
      toast.success("Client mis à jour avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores/${storeId}/customers`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du client");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      toast.success("Client supprimé avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores/${storeId}/customers`);
    } catch (error) {
      toast.error("Erreur lors de la suppression du client");
    }
  };

  if (isLoading) return <TableSkeleton rows={6} cols={2} />;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!customer) return <div>Client introuvable</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier le client</h1>
            <p className="text-muted-foreground">
              Mettre à jour les informations du client
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
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
      </div>

      <CustomerForm
        customer={customer}
        onSubmit={handleSubmit}
        isLoading={updateCustomer.isPending}
      />
    </div>
  );
}