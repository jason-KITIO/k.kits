"use client";

import { useParams, useRouter } from "next/navigation";
import { useCreateCustomer } from "@/hooks/useStore";
import { CustomerForm } from "@/components/customers/customer-form";
import { customerCreateInput } from "@/schema/customer.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const createCustomer = useCreateCustomer(organizationId, storeId);

  const handleSubmit = async (data: customerCreateInput) => {
    try {
      await createCustomer.mutateAsync(data);
      toast.success("Client créé avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores/${storeId}/customers`);
    } catch (error) {
      toast.error("Erreur lors de la création du client");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers`}
          >
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

      <CustomerForm
        onSubmit={handleSubmit}
        isLoading={createCustomer.isPending}
      />
    </div>
  );
}