import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryTree,
} from "@/types/category";

export async function fetchCategories(
  organizationId: string
): Promise<Category[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/categories`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
  return response.json();
}

export async function fetchCategoryTree(
  organizationId: string
): Promise<CategoryTree[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/categories/tree`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement de l'arbre des catégories");
  return response.json();
}

export async function fetchCategoryById(
  organizationId: string,
  categoryId: string
): Promise<Category> {
  const response = await fetch(
    `/api/organization/${organizationId}/categories/${categoryId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement de la catégorie");
  return response.json();
}

export async function createCategory(
  organizationId: string,
  data: CreateCategoryData
): Promise<Category> {
  const response = await fetch(
    `/api/organization/${organizationId}/categories`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la création de la catégorie");
  return response.json();
}

export async function updateCategory(
  organizationId: string,
  categoryId: string,
  data: UpdateCategoryData
): Promise<Category> {
  const response = await fetch(
    `/api/organization/${organizationId}/categories/${categoryId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de la catégorie");
  return response.json();
}

export async function deleteCategory(
  organizationId: string,
  categoryId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/categories/${categoryId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de la catégorie");
}
