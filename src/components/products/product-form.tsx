import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData, UpdateProductData, Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductData | UpdateProductData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    barcode: product?.barcode || "",
    unitPrice: product?.unitPrice || 0,
    costPrice: product?.costPrice || 0,
    minStock: product?.minStock || 0,
    maxStock: product?.maxStock || 0,
    unit: product?.unit || "pcs",
    color: product?.color || "",
    material: product?.material || "",
    size: product?.size || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Nom du produit"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unitPrice">Prix unitaire (FCFA)</Label>
          <Input
            id="unitPrice"
            type="number"
            placeholder="0"
            value={formData.unitPrice || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                unitPrice: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="costPrice">Prix de revient (FCFA)</Label>
          <Input
            id="costPrice"
            type="number"
            placeholder="0"
            value={formData.costPrice || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                costPrice: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minStock">Stock minimum</Label>
          <Input
            id="minStock"
            type="number"
            placeholder="0"
            value={formData.minStock || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minStock: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="maxStock">Stock Actuel</Label>
          <Input
            id="maxStock"
            type="number"
            placeholder="0"
            value={formData.maxStock || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxStock: e.target.value ? Number(e.target.value) : 0,
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit">Unité</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          />
        </div>
        {/* <div>
          <Label htmlFor="barcode">Code-barres</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          />
        </div> */}
        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            placeholder="Ex: Rouge, Bleu, Noir..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="material">Matière</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) =>
              setFormData({ ...formData, material: e.target.value })
            }
            placeholder="Ex: Cuir, Toile, Plastique..."
          />
        </div>
        <div>
          <Label htmlFor="size">Taille</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="Ex: S, M, L, XL..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : product ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
