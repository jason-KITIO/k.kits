"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCreateStore, useStore } from "@/hooks/useStore";
import React, { useState } from "react";
import { toast } from "sonner";
import { StoreFormHeader } from "@/components/pages/store-form/StoreFormHeader";
import { StoreFormCard } from "@/components/pages/store-form/StoreFormCard";

export default function NewStorePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationId = params.id as string;
  const duplicateId = searchParams.get('duplicate');
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    type: "PHYSICAL" as "PHYSICAL" | "ONLINE" | "HYBRID",
    active: true,
  });

  const { data: duplicateStore } = useStore(organizationId, duplicateId || '');
  const createStore = useCreateStore();

  React.useEffect(() => {
    if (duplicateStore) {
      setFormData({
        name: `${duplicateStore.name} (Copie)`,
        address: duplicateStore.address || "",
        phone: duplicateStore.phone || "",
        type: duplicateStore.type as "PHYSICAL" | "ONLINE" | "HYBRID",
        active: true,
      });
    }
  }, [duplicateStore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createStore.mutateAsync({
        organizationId,
        data: formData,
      });
      
      toast.success("Boutique créée avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores`);
    } catch (error) {
      toast.error("Erreur lors de la création de la boutique");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <StoreFormHeader organizationId={organizationId} isDuplicate={!!duplicateId} />
      <StoreFormCard
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={createStore.isPending}
        organizationId={organizationId}
      />
    </div>
  );
}