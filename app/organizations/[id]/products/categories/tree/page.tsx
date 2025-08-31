"use client";

import { CategoryTree } from "@/components/categories";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryTree as CategoryTreeType } from "@/types/category";
import { useState } from "react";

export default function CategoryTreePage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryTreeType | null>(null);

  const handleCategorySelect = (category: CategoryTreeType) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Arbre des catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryTree
              organizationId={organizationId}
              onCategorySelect={handleCategorySelect}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {selectedCategory.icon && (
                    <span className="text-2xl">{selectedCategory.icon}</span>
                  )}
                  <h3 className="text-xl font-semibold">
                    {selectedCategory.name}
                  </h3>
                  {selectedCategory.color && (
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                  )}
                </div>

                {selectedCategory.description && (
                  <p className="text-muted-foreground">
                    {selectedCategory.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID:</span>{" "}
                    {selectedCategory.id}
                  </div>
                  <div>
                    <span className="font-medium">Statut:</span>{" "}
                    {selectedCategory.active ? "Actif" : "Inactif"}
                  </div>
                  <div>
                    <span className="font-medium">Créé le:</span>{" "}
                    {new Date(selectedCategory.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Modifié le:</span>{" "}
                    {new Date(selectedCategory.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {selectedCategory.children &&
                  selectedCategory.children.length > 0 && (
                    <div>
                      <span className="font-medium">Sous-catégories:</span>{" "}
                      {selectedCategory.children.length}
                    </div>
                  )}

                {selectedCategory.products && (
                  <div>
                    <span className="font-medium">Produits:</span>{" "}
                    {selectedCategory.products.length}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Sélectionnez une catégorie pour voir ses détails
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
