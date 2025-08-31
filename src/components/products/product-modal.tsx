import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: unknown) => void;
  isLoading?: boolean;
}

export function ProductModal({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: ProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Modifier le produit" : "Créer un produit"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={(data) => onSubmit(data)}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
