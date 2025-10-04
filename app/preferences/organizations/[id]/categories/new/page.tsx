"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CategoryForm } from "@/components/categories/category-form";
import { useCreateCategory } from "@/hooks/useCategory";
import type { categoryCreateInput } from "@/schema/category.schema";

export default function NewCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  
  const createCategory = useCreateCategory(organizationId);

  const handleSubmit = (data: categoryCreateInput) => {
    createCategory.mutate(data, {
      onSuccess: () => {
        router.push(`/preferences/organizations/${organizationId}/categories`);
      },
    });
  };

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
          <h1 className="text-2xl font-bold">Nouvelle catégorie</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle catégorie de produits
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
            isLoading={createCategory.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}