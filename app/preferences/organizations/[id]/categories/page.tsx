"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCategories, useDeleteCategory } from "@/hooks/useCategory";
import { useCategoryColumns } from "@/hooks/features/categories/useCategoryColumns";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { data: categories, isLoading } = useCategories(organizationId);
  const deleteCategory = useDeleteCategory(organizationId);

  const handleDelete = (categoryId: string) => {
    setDeletingId(categoryId);
    deleteCategory.mutate(categoryId, {
      onSettled: () => setDeletingId(null),
    });
  };

  const columns = useCategoryColumns({ organizationId, onDelete: handleDelete, deletingId });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">Organisez vos produits par catégories</p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/categories/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={(categories as Category[]) || []}
            searchKey="name"
            searchPlaceholder="Rechercher une catégorie..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}