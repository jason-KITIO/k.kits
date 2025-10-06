"use client";

import { useParams } from "next/navigation";
import { StockTransfersHeader } from "@/components/pages/stock-transfers/StockTransfersHeader";
import { StockTransfersStats } from "@/components/pages/stock-transfers/StockTransfersStats";
import { StockTransfersEmptyState } from "@/components/pages/stock-transfers/StockTransfersEmptyState";

export default function StockTransfersPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  return (
    <div className="space-y-6 p-6">
      <StockTransfersHeader organizationId={organizationId} storeId={storeId} />
      <StockTransfersStats />
      <StockTransfersEmptyState />
    </div>
  );
}