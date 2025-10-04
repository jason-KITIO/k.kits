"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCategories, useDeleteCategory } from "@/hooks/useCategory";
import { ColumnDef } from "@tanstack/react-table";
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

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("description") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: "Statut",
      cell: ({ row }) => (
        <Badge variant={row.getValue("active") ? "default" : "secondary"}>
          {row.getValue("active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Créée le",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue<string>("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/preferences/organizations/${organizationId}/categories/${category.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(category.id)}
                disabled={deletingId === category.id}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletingId === category.id ? "Suppression..." : "Supprimer"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">
            Organisez vos produits par catégories
          </p>
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