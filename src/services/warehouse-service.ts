import {
  Warehouse,
  WarehouseStock,
  StockLocation,
  CreateWarehouseData,
  UpdateWarehouseData,
  CreateLocationData,
  UpdateLocationData,
} from "@/types/warehouse";

// Warehouses
export async function fetchWarehouses(
  organizationId: string
): Promise<Warehouse[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des entrepôts");
  return response.json();
}

export async function createWarehouse(
  organizationId: string,
  data: CreateWarehouseData
): Promise<Warehouse> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la création de l'entrepôt");
  return response.json();
}

export async function updateWarehouse(
  organizationId: string,
  warehouseId: string,
  data: UpdateWarehouseData
): Promise<Warehouse> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses/${warehouseId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de l'entrepôt");
  return response.json();
}

export async function deleteWarehouse(
  organizationId: string,
  warehouseId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses/${warehouseId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de l'entrepôt");
}

// Warehouse Stock
export async function fetchWarehouseStock(
  organizationId: string,
  warehouseId?: string
): Promise<WarehouseStock[]> {
  const url = warehouseId
    ? `/api/organization/${organizationId}/warehouse-stock/${warehouseId}`
    : `/api/organization/${organizationId}/warehouse-stock`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du chargement du stock");
  return response.json();
}

// Stock Locations
export async function fetchLocations(
  organizationId: string,
  warehouseId: string
): Promise<StockLocation[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses/${warehouseId}/locations`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des emplacements");
  return response.json();
}

export async function createLocation(
  organizationId: string,
  warehouseId: string,
  data: CreateLocationData
): Promise<StockLocation> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses/${warehouseId}/locations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la création de l'emplacement");
  return response.json();
}

export async function updateLocation(
  organizationId: string,
  warehouseId: string,
  locationId: string,
  data: UpdateLocationData
): Promise<StockLocation> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses/${warehouseId}/locations/${locationId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de l'emplacement");
  return response.json();
}

export async function deleteLocation(
  organizationId: string,
  warehouseId: string,
  locationId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/warehouses/${warehouseId}/locations/${locationId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de l'emplacement");
}
