"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "@/components/categories/category-form";
import { useCategory, useUpdateCategory } from "@/hooks/useCategory";
import type { categoryUpdateInput } from "@/schema/category.schema";
import { CategoryEditHeader } from "@/components/pages/category-edit/CategoryEditHeader";
import { CategoryEditLoadingSkeleton } from "@/components/pages/category-edit/CategoryEditLoadingSkeleton";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const categoryId = params.categoryId as string;
  
  const { data: category, isLoading } = useCategory(organizationId, categoryId);
  const updateCategory = useUpdateCategory(organizationId);

  const handleSubmit = (data: categoryUpdateInput) => {
    updateCategory.mutate({ categoryId, data }, {
      onSuccess: () => {
        router.push(`/preferences/organizations/${organizationId}/categories`);
      },
    });
  };

  if (isLoading) return <CategoryEditLoadingSkeleton />;

  if (!category) {
    return <div>Catégorie non trouvée</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <CategoryEditHeader organizationId={organizationId} />
      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm onSubmit={handleSubmit} defaultValues={category} isLoading={updateCategory.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}