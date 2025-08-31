import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StockAlert, Notification } from "@/types/alert";
import * as alertService from "@/services/alert-service";

export function useStockAlerts(organizationId: string) {
  return useQuery<StockAlert[]>({
    queryKey: ["stock-alerts", organizationId],
    queryFn: () => alertService.fetchStockAlerts(organizationId),
  });
}

export function useLowStockAlerts(organizationId: string) {
  return useQuery<StockAlert[]>({
    queryKey: ["stock-alerts", "low-stock", organizationId],
    queryFn: () => alertService.fetchLowStockAlerts(organizationId),
  });
}

export function useAcknowledgeAlert(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) =>
      alertService.acknowledgeAlert(organizationId, alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-alerts", organizationId],
      });
    },
  });
}

export function useResolveAlert(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) =>
      alertService.resolveAlert(organizationId, alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-alerts", organizationId],
      });
    },
  });
}

export function useNotifications(organizationId: string) {
  return useQuery<Notification[]>({
    queryKey: ["notifications", organizationId],
    queryFn: () => alertService.fetchNotifications(organizationId),
  });
}

export function useMarkNotificationAsRead(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      alertService.markNotificationAsRead(organizationId, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", organizationId],
      });
    },
  });
}
