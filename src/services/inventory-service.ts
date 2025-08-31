import {
  StockInventory,
  CreateInventoryData,
  UpdateInventoryData,
} from "@/types/inventory";

export async function fetchInventories(
  organizationId: string
): Promise<StockInventory[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-inventories`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des inventaires");
  return response.json();
}

export async function fetchScheduledInventories(
  organizationId: string
): Promise<StockInventory[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-inventories/scheduled`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des inventaires planifiés");
  return response.json();
}

export async function createInventory(
  organizationId: string,
  data: CreateInventoryData
): Promise<StockInventory> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-inventories`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la création de l'inventaire");
  return response.json();
}

export async function updateInventory(
  organizationId: string,
  inventoryId: string,
  data: UpdateInventoryData
): Promise<StockInventory> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-inventories/${inventoryId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de l'inventaire");
  return response.json();
}

export async function deleteInventory(
  organizationId: string,
  inventoryId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-inventories/${inventoryId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de l'inventaire");
}
