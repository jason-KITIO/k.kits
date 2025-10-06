"use client";

import { useParams, useRouter } from "next/navigation";
import { useSuppliers, useUpdateSupplier } from "@/hooks/useSuppliers";
import { type SupplierCreateInput } from "@/schema/supplier.schema";

export function useSupplierEdit() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const supplierId = params.supplierId as string;
  
  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);
  const updateSupplier = useUpdateSupplier(organizationId);
  const supplier = suppliers.find(s => s.id === supplierId);

  const handleSubmit = async (data: SupplierCreateInput) => {
    await updateSupplier.mutateAsync({ id: supplierId, data });
    router.push(`/preferences/organizations/${organizationId}/suppliers/${supplierId}`);
  };

  const handleCancel = () => {
    router.push(`/preferences/organizations/${organizationId}/suppliers/${supplierId}`);
  };

  const defaultValues = supplier ? {
    name: supplier.name,
    email: supplier.email || "",
    phone: supplier.phone || "",
    address: supplier.address || "",
    contactPerson: supplier.contactPerson || "",
    taxNumber: supplier.taxNumber || "",
    paymentTerms: supplier.paymentTerms || "",
    notes: supplier.notes || "",
    active: supplier.active,
  } : undefined;

  return {
    organizationId,
    supplierId,
    supplier,
    isLoading,
    defaultValues,
    handleSubmit,
    handleCancel,
    isUpdating: updateSupplier.isPending,
  };
}