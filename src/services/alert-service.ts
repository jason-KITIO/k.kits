import { StockAlert, Notification } from "@/types/alert";

export async function fetchStockAlerts(
  organizationId: string
): Promise<StockAlert[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-alerts`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors du chargement des alertes");
  return response.json();
}

export async function fetchLowStockAlerts(
  organizationId: string
): Promise<StockAlert[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-alerts/low-stock`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des alertes stock bas");
  return response.json();
}

export async function acknowledgeAlert(
  organizationId: string,
  alertId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-alerts/${alertId}/acknowledge`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de l'accusé de réception");
}

export async function resolveAlert(
  organizationId: string,
  alertId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/stock-alerts/${alertId}/resolve`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors de la résolution");
}

export async function fetchNotifications(
  organizationId: string
): Promise<Notification[]> {
  const response = await fetch(
    `/api/organization/${organizationId}/notifications`,
    {
      credentials: "include",
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors du chargement des notifications");
  return response.json();
}

export async function markNotificationAsRead(
  organizationId: string,
  notificationId: string
): Promise<void> {
  const response = await fetch(
    `/api/organization/${organizationId}/notifications/${notificationId}/read`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Erreur lors du marquage comme lu");
}
