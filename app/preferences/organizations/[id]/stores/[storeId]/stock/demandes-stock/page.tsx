"use client";

import { use } from "react";
import { useStockMovementRequests } from "@/hooks/use-stock-movement-requests";
import { StockMovementRequestList } from "@/components/stock-movement-requests/stock-movement-request-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Déplacer des Articles</h1>
          <p className="text-muted-foreground">
            Demandez à déplacer des marchandises d'un endroit à un autre
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toutes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">demandes créées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">⏳ En Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending > 0 ? "à valider" : "tout traité"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">✓ Acceptées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">demandes ok</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">✗ Refusées</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">pas autorisées</p>
          </CardContent>
        </Card>
      </div>

      <StockMovementRequestList 
        organizationId={organizationId} 
        storeId={storeId} 
      />
    </div>
  );
}