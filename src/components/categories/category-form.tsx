import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateCategoryData,
  UpdateCategoryData,
  Category,
} from "@/types/category";

interface CategoryFormProps {
  category?: Category;
  categories?: Category[];
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({
  category,
  categories = [],
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    color: category?.color || "",
    icon: category?.icon || "",
    parentId: category?.parentId || "none",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      parentId: formData.parentId === "none" ? undefined : formData.parentId,
    };
    onSubmit(data);
  };

  // Filtrer les catégories pour éviter la sélection de soi-même ou de ses enfants
  const availableParents = categories.filter(
    (cat) => cat.id !== category?.id && cat.parentId !== category?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Nom de la catégorie"
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
          placeholder="Description de la catégorie"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="icon">Icône</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Ex: 📱, 💻, 👕..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="parentId">Catégorie parent</Label>
        <Select
          value={formData.parentId}
          onValueChange={(value) =>
            setFormData({ ...formData, parentId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie parent (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune (catégorie racine)</SelectItem>
            {availableParents.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : category ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
