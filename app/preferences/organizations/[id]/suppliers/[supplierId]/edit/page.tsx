"use client";

import { PageHeader, LoadingSkeleton, ErrorDisplay } from "@/components/shared";
import { SupplierForm } from "@/components/forms/supplier-form";
import { useSupplierEdit } from "@/hooks/pages/use-supplier-edit";

export default function EditSupplierPage() {
  const {
    supplier,
    isLoading,
    defaultValues,
    handleSubmit,
    handleCancel,
    isUpdating,
  } = useSupplierEdit();

  if (isLoading) return <LoadingSkeleton type="form" columns={4} />;
  if (!supplier) return <ErrorDisplay message="Fournisseur non trouvé" />;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Modifier ${supplier.name}`}
        description="Mettre à jour les informations du fournisseur"
      />

      <SupplierForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        submitText="Mettre à jour"
        onCancel={handleCancel}
      />
    </div>
  );
}