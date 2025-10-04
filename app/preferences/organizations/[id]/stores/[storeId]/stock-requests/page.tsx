"use client";

import { useParams } from "next/navigation";
import { useStockMovementRequests, useApproveStockRequest } from "@/hooks/use-stock-movement-requests";
import { CreateRequestDialog } from "@/components/stock-movement-requests/create-request-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

type StockRequest = {
  id: string;
  quantity: number;
  status: string;
  urgencyLevel: string;
  reason?: string;
  createdAt: string;
  product: {
    id: string;
    sku: string;
    name: string;
    color: string;
  };
  requester: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    PENDING: { variant: "secondary" as const, label: "En attente", icon: Clock },
    APPROVED: { variant: "default" as const, label: "Approuvé", icon: CheckCircle },
    COMPLETED: { variant: "default" as const, label: "Terminé", icon: CheckCircle },
    REJECTED: { variant: "destructive" as const, label: "Rejeté", icon: AlertCircle },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getUrgencyBadge = (level: string) => {
  const urgencyConfig = {
    LOW: { variant: "outline" as const, label: "Faible" },
    MEDIUM: { variant: "secondary" as const, label: "Moyenne" },
    HIGH: { variant: "destructive" as const, label: "Élevée" },
  };
  
  const config = urgencyConfig[level as keyof typeof urgencyConfig] || urgencyConfig.MEDIUM;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function StockRequestsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const { data: requests, isLoading } = useStockMovementRequests(organizationId, storeId);
  const approveRequest = useApproveStockRequest(organizationId, storeId);

  const columns: ColumnDef<StockRequest>[] = [
    {
      accessorFn: (row) => row.product.sku,
      header: "SKU",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.product.sku}</div>
      ),
    },
    {
      accessorFn: (row) => row.product.name,
      header: "Produit",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border" 
            style={{ backgroundColor: row.original.product.color }}
          />
          <span className="font-medium">{row.original.product.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
      cell: ({ row }) => (
        <span className="font-semibold">{row.getValue("quantity")}</span>
      ),
    },
    {
      accessorFn: (row) => `${row.requester.firstName || ''} ${row.requester.lastName || ''}`.trim(),
      header: "Demandeur",
      cell: ({ row }) => {
        const name = `${row.original.requester.firstName || ''} ${row.original.requester.lastName || ''}`.trim();
        return name || "Utilisateur";
      },
    },
    {
      accessorKey: "urgencyLevel",
      header: "Urgence",
      cell: ({ row }) => getUrgencyBadge(row.getValue("urgencyLevel")),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "reason",
      header: "Motif",
      cell: ({ row }) => row.getValue("reason") || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue<string>("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original;
        if (request.status !== "PENDING") return null;
        
        return (
          <Button
            size="sm"
            onClick={() => approveRequest.mutate(request.id)}
            disabled={approveRequest.isPending}
          >
            {approveRequest.isPending ? "Traitement..." : "Approuver"}
          </Button>
        );
      },
    },
  ];

  if (isLoading) return <div>Chargement...</div>;

  const pendingCount = requests?.filter((r: StockRequest) => r.status === "PENDING").length || 0;
  const completedCount = requests?.filter((r: StockRequest) => r.status === "COMPLETED").length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Requêtes de Stock</h1>
          <p className="text-muted-foreground">
            Gérez les demandes de transfert de stock des employés
          </p>
        </div>
        <CreateRequestDialog organizationId={organizationId} storeId={storeId} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les requêtes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={requests || []} />
        </CardContent>
      </Card>
    </div>
  );
}