"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal, Package, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StatusBadge } from "@/components/shared";

interface PurchaseOrderHeaderProps {
  organizationId: string;
  warehouseId: string;
  order: {
    orderNumber: string;
    status: string;
    createdAt: string;
    totalAmount: number;
  };
  formatCurrency: (amount: number) => string;
  onMarkAsReceived: () => void;
  isMarkingAsReceived: boolean;
}

export function PurchaseOrderHeader({ 
  organizationId, 
  warehouseId, 
  order, 
  formatCurrency, 
  onMarkAsReceived, 
  isMarkingAsReceived 
}: PurchaseOrderHeaderProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold">Commande {order.orderNumber}</h1>
            <div className="flex items-center gap-4 mt-1">
              <StatusBadge status={order.status} />
              <span className="text-sm text-muted-foreground">
                Créée le {format(new Date(order.createdAt), "PPP", { locale: fr })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={onMarkAsReceived}
                disabled={order.status === 'RECEIVED' || isMarkingAsReceived}
              >
                <Package className="h-4 w-4 mr-2" />
                {isMarkingAsReceived ? 'Traitement...' : 'Marquer comme reçue'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Modifier la date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}