import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  category?: { name: string };
}

interface ProductItemRowProps {
  index: number;
  productId: string;
  quantity: number;
  unitPrice: number;
  products?: Product[];
  isLoading: boolean;
  onProductChange: (productId: string, index: number) => void;
  onQuantityChange: (quantity: number) => void;
  onPriceChange: (price: number) => void;
  onRemove: () => void;
  canRemove: boolean;
  formatCurrency: (amount: number) => string;
}

export function ProductItemRow({
  productId, quantity, unitPrice, products, isLoading,
  onProductChange, onQuantityChange, onPriceChange, onRemove, canRemove, formatCurrency, index
}: ProductItemRowProps) {
  return (
    <div className="flex gap-2 items-end">
      <FormItem className="flex-1">
        <FormLabel>Produit</FormLabel>
        <Select onValueChange={(value) => onProductChange(value, index)} defaultValue={productId}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Produit" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="" disabled>Chargement...</SelectItem>
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        SKU: {product.sku}{product.category && ` • ${product.category.name}`}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(product.unitPrice)}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>Aucun produit disponible</SelectItem>
            )}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>

      <FormItem className="w-24">
        <FormLabel>Qté</FormLabel>
        <FormControl>
          <Input type="number" min="1" value={quantity} onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)} />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem className="w-32">
        <FormLabel>Prix unitaire</FormLabel>
        <FormControl>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={unitPrice || ''}
            onChange={(e) => onPriceChange(e.target.value === '' ? 0 : Number(e.target.value))}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      <Button type="button" variant="outline" size="sm" onClick={onRemove} disabled={!canRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
