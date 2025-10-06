"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreateSale, useStoreCustomers } from "@/hooks/useStore";
import { useOptimizedQuery } from "@/hooks/use-optimized-query";
import { toast } from "sonner";

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export function useNewSale() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  
  const [saleData, setSaleData] = useState({
    customerId: "",
    items: [{ productId: "", quantity: 1, unitPrice: 0, discount: 0 }] as SaleItem[],
  });

  const createSale = useCreateSale(organizationId, storeId);
  const { data: customers } = useStoreCustomers(organizationId, storeId);
  const { data: storeStock } = useOptimizedQuery({
    queryKey: ["store-stock", organizationId, storeId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/stores/${storeId}/stock`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Erreur lors de la récupération du stock");
      return response.json();
    },
    enabled: !!organizationId && !!storeId,
  });

  const addItem = () => {
    setSaleData(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: 0, discount: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "productId") {
            const stockItem = storeStock?.find((s: any) => s.product.id === updatedItem.productId);
            if (stockItem && field === "quantity" && Number(value) > stockItem.quantity) {
              toast.error(`Stock insuffisant. Disponible: ${stockItem.quantity}`);
              return { ...item, quantity: stockItem.quantity };
            }
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const totalAmount = saleData.items.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice), 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = saleData.items.filter(item => 
      item.productId && item.quantity > 0 && item.unitPrice > 0
    );
    
    if (validItems.length === 0) {
      toast.error("Veuillez ajouter au moins un article valide");
      return;
    }
    
    try {
      const submitData = {
        customerId: saleData.customerId === "__no_customer__" ? undefined : saleData.customerId,
        totalAmount,
        paidAmount: totalAmount,
        status: "PAID" as const,
        items: validItems.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount) || 0
        }))
      };
      
      await createSale.mutateAsync(submitData);
      toast.success("Vente enregistrée avec succès !");
      router.push(`/preferences/organizations/${organizationId}/stores/${storeId}/sales`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la vente";
      toast.error(errorMessage);
    }
  };

  return {
    organizationId,
    storeId,
    saleData,
    setSaleData,
    customers,
    storeStock,
    totalAmount,
    addItem,
    removeItem,
    updateItem,
    handleSubmit,
    isCreating: createSale.isPending,
  };
}