"use client";

import { use } from "react";
import { useStockMovementRequests } from "@/hooks/use-stock-movement-requests";
import { StockMovementRequestList } from "@/components/stock-movement-requests/stock-movement-request-list";
import { DemandesStockHeader } from "@/components/pages/demandes-stock/DemandesStockHeader";
import { DemandesStockStats } from "@/components/pages/demandes-stock/DemandesStockStats";

interface PageProps {
  params: Promise<{ id: string; storeId: string }>;
}

export default function DemandesStockPage({ params }: PageProps) {
  const { id: organizationId, storeId } = use(params);
  
  // Charger les statistiques réelles
  const { data: allRequests } = useStockMovementRequests(organizationId, storeId);

  const stats = {
    pending: allRequests?.filter((r: { status: string }) => r.status === "PENDING").length || 0,
    approved: allRequests?.filter((r: { status: string }) => r.status === "APPROVED").length || 0,
    rejected: allRequests?.filter((r: { status: string }) => r.status === "REJECTED").length || 0,
    total: allRequests?.length || 0
  };

  return (
    <div className="space-y-6 p-6">
      <DemandesStockHeader organizationId={organizationId} storeId={storeId} />
      <DemandesStockStats stats={stats} />
      <StockMovementRequestList organizationId={organizationId} storeId={storeId} />
    </div>
  );
}