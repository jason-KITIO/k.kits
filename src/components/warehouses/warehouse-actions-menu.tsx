"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Package, ArrowRightLeft, Store, Settings, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface WarehouseActionsMenuProps {
  organizationId: string;
  warehouseId: string;
  hasStock: boolean;
  onRestock: () => void;
  onTransfer: () => void;
  onStoreTransfer: () => void;
  onDelete: () => void;
}

export function WarehouseActionsMenu({ organizationId, warehouseId, hasStock, onRestock, onTransfer, onStoreTransfer, onDelete }: WarehouseActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onRestock}>
          <Package className="h-4 w-4 mr-2" />
          Recharger produits
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTransfer} disabled={!hasStock}>
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Transférer vers entrepôt
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStoreTransfer} disabled={!hasStock}>
          <Store className="h-4 w-4 mr-2" />
          Transférer vers boutique
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}/edit`}>
            <Settings className="h-4 w-4 mr-2" />
            Modifier l'entrepôt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/preferences/organizations/${organizationId}/warehouses/new?duplicate=${warehouseId}`}>
            <Plus className="h-4 w-4 mr-2" />
            Dupliquer l'entrepôt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer l'entrepôt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
