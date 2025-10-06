"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface SaleItemFormProps {
  items: SaleItem[];
  storeStock: any[];
  onUpdateItem: (index: number, field: string, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export function SaleItemForm({ 
  items, 
  storeStock, 
  onUpdateItem, 
  onAddItem, 
  onRemoveItem 
}: SaleItemFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Que vend-on ?</h3>
        <Button type="button" onClick={onAddItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-5">
            <Label>Article</Label>
            <Select
              value={item.productId}
              onValueChange={(value) => {
                const stockItem = storeStock?.find((s: any) => s.product.id === value);
                onUpdateItem(index, "productId", value);
                if (stockItem) {
                  onUpdateItem(index, "unitPrice", stockItem.product.unitPrice);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir l'article vendu..." />
              </SelectTrigger>
              <SelectContent>
                {storeStock?.filter((stock: any) => stock.quantity > 0).map((stock: any) => (
                  <SelectItem key={stock.product.id} value={stock.product.id}>
                    {stock.product.name} - {stock.product.unitPrice?.toLocaleString()} FCFA (Stock: {stock.quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2">
            <Label>Combien ?</Label>
            <Input
              type="number"
              min="1"
              max={storeStock?.find((s: any) => s.product.id === item.productId)?.quantity || 999}
              value={item.quantity}
              onChange={(e) => onUpdateItem(index, "quantity", parseInt(e.target.value) || 1)}
              required
            />
            {item.productId && (
              <p className="text-xs text-muted-foreground mt-1">
                Stock: {storeStock?.find((s: any) => s.product.id === item.productId)?.quantity || 0}
              </p>
            )}
          </div>
          
          <div className="col-span-3">
            <Label>Prix à l'unité</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={item.unitPrice}
              onChange={(e) => onUpdateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          
          <div className="col-span-1">
            <Label>Sous-total</Label>
            <div className="text-sm font-medium p-2">
              {(item.quantity * item.unitPrice).toLocaleString()} FCFA
            </div>
          </div>
          
          <div className="col-span-1">
            {items.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}