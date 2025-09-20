import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organization-service";
import type {
  NotificationCreateInput,
  StockTransferCreateInput,
} from "@/schema";

export const useOrganizationDashboard = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "dashboard"],
    queryFn: async () => await organizationService.getDashboard(organizationId),
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrganizationSales = (
  organizationId: string,
  params?: { storeId?: string; startDate?: string; endDate?: string }
) => {
  return useQuery({
    queryKey: ["organization", organizationId, "sales", params],
    queryFn: async () =>
      await organizationService.getSales(organizationId, params),
    enabled: !!organizationId,
    staleTime: 30 * 1000,
  });
};

export const useNotifications = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "notifications"],
    queryFn: async () =>
      await organizationService.getNotifications(organizationId),
    enabled: !!organizationId,
    staleTime: 10 * 1000,
  });
};

export const useStockAlerts = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stock-alerts"],
    queryFn: async () =>
      await organizationService.getStockAlerts(organizationId),
    enabled: !!organizationId,
    staleTime: 30 * 1000,
  });
};

export const useStockTransfers = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stock-transfers"],
    queryFn: async () =>
      await organizationService.getStockTransfers(organizationId),
    enabled: !!organizationId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useOrganizationUsers = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "users"],
    queryFn: async () => await organizationService.getUsers(organizationId),
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useOrganizationSearch = (
  organizationId: string,
  query: string,
  type: "products" | "customers" | "suppliers"
) => {
  return useQuery({
    queryKey: ["organization", organizationId, "search", query, type],
    queryFn: async () =>
      await organizationService.search(organizationId, query, type),
    enabled: !!organizationId && !!query && query.length > 2,
    staleTime: 30 * 1000,
  });
};

export const useOrganizationReports = (
  organizationId: string,
  type: "sales" | "stock" | "movements" | "profit",
  params?: { startDate?: string; endDate?: string }
) => {
  return useQuery({
    queryKey: ["organization", organizationId, "reports", type, params],
    queryFn: async () =>
      await organizationService.getReports(organizationId, type, params),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationSettings = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "settings"],
    queryFn: async () => await organizationService.getSettings(organizationId),
    enabled: !!organizationId,
    staleTime: 15 * 60 * 1000,
  });
};

export const useCreateNotification = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NotificationCreateInput) =>
      await organizationService.createNotification(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "notifications"],
      });
    },
  });
};

export const useMarkNotificationsRead = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      notificationIds?: string[];
      markAllAsRead?: boolean;
    }) => await organizationService.markNotificationsRead(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "notifications"],
      });
    },
  });
};

export const useCreateStockTransfer = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockTransferCreateInput) =>
      await organizationService.createStockTransfer(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stock-transfers"],
      });
    },
  });
};

export const useUpdateOrganizationSettings = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) =>
      await organizationService.updateSettings(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "settings"],
      });
    },
  });
};
