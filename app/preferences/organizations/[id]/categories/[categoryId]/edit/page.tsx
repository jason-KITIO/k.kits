"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CategoryForm } from "@/components/categories/category-form";
import { useCategory, useUpdateCategory } from "@/hooks/useCategory";
import type { categoryUpdateInput } from "@/schema/category.schema";

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!category) {
    return <div>Catégorie non trouvée</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/categories`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Modifier la catégorie</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de la catégorie
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            onSubmit={handleSubmit}
            defaultValues={category}
            isLoading={updateCategory.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}