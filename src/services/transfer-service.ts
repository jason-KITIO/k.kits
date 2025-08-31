import { StockTransfer, CreateTransferData } from "@/types/transfer";

export async function fetchTransfers(
  organizationId: string
): Promise<StockTransfer[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des transferts");
  return response.json();
}

export async function fetchPendingTransfers(
  organizationId: string
): Promise<StockTransfer[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/pending`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des transferts en attente");
  return response.json();
}

export async function fetchMyRequests(
  organizationId: string
): Promise<StockTransfer[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/my-requests`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement de mes demandes");
  return response.json();
}

export async function createTransfer(
  organizationId: string,
  data: CreateTransferData
): Promise<StockTransfer> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la création du transfert");
  return response.json();
}

export async function approveTransfer(
  organizationId: string,
  transferId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/${transferId}/approve`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'approbation");
}

export async function completeTransfer(
  organizationId: string,
  transferId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/${transferId}/complete`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la finalisation");
}

export async function cancelTransfer(
  organizationId: string,
  transferId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-transfers/${transferId}/cancel`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'annulation");
}
