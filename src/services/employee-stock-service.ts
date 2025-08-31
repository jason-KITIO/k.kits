import {
  EmployeeStock,
  StockRequest,
  StockAdjustment,
  CreateStockRequestData,
  CreateAdjustmentData,
} from "@/types/employee-stock";

// Employee Stock
export async function fetchEmployeeStock(
  organizationId: string,
  userId?: string
): Promise<EmployeeStock[]> {
  const url = userId
    ? `/api/organization/${organizationId}/employee-stock/${userId}`
    : `/api/organization/${organizationId}/employee-stock`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok)
    throw new Error("Erreur lors du chargement du stock employé");
  return response.json();
}

export async function adjustEmployeeStock(
  organizationId: string,
  data: CreateAdjustmentData
): Promise<StockAdjustment> {
  const response = await fetch(
    `/api/organization/${organizationId}/employee-stock/adjust`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'ajustement du stock");
  return response.json();
}

// Stock Requests
export async function fetchStockRequests(
  organizationId: string,
  userId?: string
): Promise<StockRequest[]> {
  const url = userId
    ? `/api/organization/${organizationId}/stock-transfers/my-requests`
    : `/api/organization/${organizationId}/stock-transfers`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du chargement des demandes");
  return response.json();
}

export async function createStockRequest(
  organizationId: string,
  data: CreateStockRequestData
): Promise<StockRequest> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la création de la demande");
  return response.json();
}

export async function approveStockRequest(
  organizationId: string,
  requestId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/${requestId}/approve`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'approbation");
}

export async function cancelStockRequest(
  organizationId: string,
  requestId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/${requestId}/cancel`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'annulation");
}

// Stock Adjustments History
export async function fetchStockAdjustments(
  organizationId: string,
  userId?: string
): Promise<StockAdjustment[]> {
  const url = userId
    ? `/api/organization/${organizationId}/stock-movements/employee/${userId}`
    : `/api/organization/${organizationId}/stock-movements`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok)
    throw new Error("Erreur lors du chargement des ajustements");
  return response.json();
}
