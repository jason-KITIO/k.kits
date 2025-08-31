"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryModal } from "./category-modal";
import { DeleteCategoryModal } from "./delete-category-modal";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";
import { toast } from "sonner";

interface CategoriesManagerProps {
  organizationId: string;
}

export function CategoriesManager({ organizationId }: CategoriesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const { data: categories = [], isLoading } = useCategories(organizationId);
  const createMutation = useCreateCategory(organizationId);
  const updateMutation = useUpdateCategory(organizationId);
  const deleteMutation = useDeleteCategory(organizationId);

  const handleCreate = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (
    data: CreateCategoryData | UpdateCategoryData
  ) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory.id, data });
        toast.success("Catégorie modifiée avec succès");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Catégorie créée avec succès");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteMutation.mutateAsync(selectedCategory.id);
      toast.success("Catégorie supprimée avec succès");
      setIsDeleteModalOpen(false);
    } catch {
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  const renderCategoryCard = (category: Category, level = 0) => (
    <div key={category.id} className={`ml-${level * 4}`}>
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {category.icon && (
                <span className="text-lg">{category.icon}</span>
              )}
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
              {category.color && (
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: category.color }}
                />
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(category)}
              >
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(category)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {category.children?.map((child) => renderCategoryCard(child, level + 1))}
    </div>
  );

  if (isLoading) {
    return <div>Chargement des catégories...</div>;
  }

  const rootCategories = categories.filter((cat) => !cat.parentId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des catégories</h2>
        <Button onClick={handleCreate}>Nouvelle catégorie</Button>
      </div>

      <div className="space-y-2">
        {rootCategories.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Aucune catégorie trouvée</p>
              <Button className="mt-4" onClick={handleCreate}>
                Créer votre première catégorie
              </Button>
            </CardContent>
          </Card>
        ) : (
          rootCategories.map((category) => renderCategoryCard(category))
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={selectedCategory}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
