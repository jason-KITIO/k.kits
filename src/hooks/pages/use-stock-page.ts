"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useStoreStock, useCreateStoreStockAdjustment } from "@/hooks/useStore";
import { type StockMovementAdjustmentInput } from "@/schema";

export function useStockPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  const [selectedStock, setSelectedStock] = useState<any>(null);

  const { data: stocks, isLoading, error } = useStoreStock(organizationId, storeId);
  const createAdjustment = useCreateStoreStockAdjustment(organizationId, storeId);

  const handleAdjustment = async (data: StockMovementAdjustmentInput) => {
    await createAdjustment.mutateAsync(data);
    setSelectedStock(null);
  };

  return {
    organizationId,
    storeId,
    stocks,
    isLoading,
    error,
    selectedStock,
    setSelectedStock,
    handleAdjustment,
    isAdjusting: createAdjustment.isPending,
  };
}