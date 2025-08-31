import {
  StockReport,
  MovementReport,
  PerformanceReport,
  ExportData,
} from "@/types/report";

export async function fetchStockReport(
  organizationId: string,
  warehouseId?: string
): Promise<StockReport[]> {
  const url = warehouseId
    ? `/api/organization/${organizationId}/reports/stock?warehouseId=${warehouseId}`
    : `/api/organization/${organizationId}/reports/stock`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok)
    throw new Error("Erreur lors du chargement du rapport de stock");
  return response.json();
}

export async function fetchMovementReport(
  organizationId: string,
  dateFrom?: string,
  dateTo?: string
): Promise<MovementReport[]> {
  let url = `/api/organization/${organizationId}/reports/movements`;
  const params = new URLSearchParams();

  if (dateFrom) params.append("dateFrom", dateFrom);
  if (dateTo) params.append("dateTo", dateTo);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok)
    throw new Error("Erreur lors du chargement du rapport de mouvements");
  return response.json();
}

export async function fetchPerformanceReport(
  organizationId: string
): Promise<PerformanceReport> {
  const response = await fetch(
    `/api/organization/${organizationId}/reports/performance`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement du rapport de performance");
  return response.json();
}

export async function exportData(
  organizationId: string,
  exportConfig: ExportData
): Promise<Blob> {
  const response = await fetch(
    `/api/organization/${organizationId}/reports/export`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(exportConfig),
    }
  );

  if (!response.ok) throw new Error("Erreur lors de l'export des données");
  return response.blob();
}
