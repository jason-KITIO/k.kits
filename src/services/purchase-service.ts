import {
  PurchaseOrder,
  Supplier,
  CreatePurchaseOrderData,
  CreateSupplierData,
} from "@/types/purchase";

// Purchase Orders
export async function fetchPurchaseOrders(
  organizationId: string
): Promise<PurchaseOrder[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/purchase-orders`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
  return response.json();
}

export async function createPurchaseOrder(
  organizationId: string,
  data: CreatePurchaseOrderData
): Promise<PurchaseOrder> {
  const response = await fetch(
    `/api/organization/${organizationId}/purchase-orders`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la création de la commande");
  return response.json();
}

export async function updatePurchaseOrder(
  organizationId: string,
  orderId: string,
  data: Partial<CreatePurchaseOrderData>
): Promise<PurchaseOrder> {
  const response = await fetch(
    `/api/organization/${organizationId}/purchase-orders/${orderId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de la commande");
  return response.json();
}

export async function deletePurchaseOrder(
  organizationId: string,
  orderId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/purchase-orders/${orderId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de la commande");
}

// Suppliers
export async function fetchSuppliers(
  organizationId: string
): Promise<Supplier[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/suppliers`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des fournisseurs");
  return response.json();
}

export async function createSupplier(
  organizationId: string,
  data: CreateSupplierData
): Promise<Supplier> {
  const response = await fetch(
    `/api/organization/${organizationId}/suppliers`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la création du fournisseur");
  return response.json();
}

export async function updateSupplier(
  organizationId: string,
  supplierId: string,
  data: Partial<CreateSupplierData>
): Promise<Supplier> {
  const response = await fetch(
    `/api/organization/${organizationId}/suppliers/${supplierId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour du fournisseur");
  return response.json();
}

export async function deleteSupplier(
  organizationId: string,
  supplierId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/suppliers/${supplierId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la suppression du fournisseur");
}
