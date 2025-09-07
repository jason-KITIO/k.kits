import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService, type DashboardData, type Sale, type Notification, type StockAlert, type OrganizationMember } from '@/services/organizationService';
import type { NotificationCreateInput, StockTransferCreateInput } from '@/schema';

export const useOrganizationDashboard = (organizationId: string) => {
  return useQuery<DashboardData>({
    queryKey: ['organization', organizationId, 'dashboard'],
    queryFn: () => organizationService.getDashboard(organizationId),
    enabled: !!organizationId,
  });
};

export const useOrganizationSales = (
  organizationId: string, 
  params?: { storeId?: string; startDate?: string; endDate?: string }
) => {
  return useQuery<Sale[]>({
    queryKey: ['organization', organizationId, 'sales', params],
    queryFn: () => organizationService.getSales(organizationId, params),
    enabled: !!organizationId,
  });
};

export const useNotifications = (organizationId: string) => {
  return useQuery<Notification[]>({
    queryKey: ['organization', organizationId, 'notifications'],
    queryFn: () => organizationService.getNotifications(organizationId),
    enabled: !!organizationId,
  });
};

export const useCreateNotification = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NotificationCreateInput) => 
      organizationService.createNotification(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'notifications'] 
      });
    },
  });
};

export const useMarkNotificationsRead = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { notificationIds?: string[]; markAllAsRead?: boolean }) =>
      organizationService.markNotificationsRead(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'notifications'] 
      });
    },
  });
};

export const useStockAlerts = (organizationId: string) => {
  return useQuery<StockAlert[]>({
    queryKey: ['organization', organizationId, 'stock-alerts'],
    queryFn: () => organizationService.getStockAlerts(organizationId),
    enabled: !!organizationId,
  });
};

export const useStockTransfers = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization', organizationId, 'stock-transfers'],
    queryFn: () => organizationService.getStockTransfers(organizationId),
    enabled: !!organizationId,
  });
};

export const useCreateStockTransfer = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockTransferCreateInput) =>
      organizationService.createStockTransfer(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'stock-transfers'] 
      });
    },
  });
};

export const useOrganizationUsers = (organizationId: string) => {
  return useQuery<OrganizationMember[]>({
    queryKey: ['organization', organizationId, 'users'],
    queryFn: () => organizationService.getUsers(organizationId),
    enabled: !!organizationId,
  });
};

export const useOrganizationSearch = (
  organizationId: string, 
  query: string, 
  type: 'products' | 'customers' | 'suppliers'
) => {
  return useQuery({
    queryKey: ['organization', organizationId, 'search', query, type],
    queryFn: () => organizationService.search(organizationId, query, type),
    enabled: !!organizationId && !!query && query.length > 2,
  });
};

export const useOrganizationReports = (
  organizationId: string,
  type: 'sales' | 'stock' | 'movements' | 'profit',
  params?: { startDate?: string; endDate?: string }
) => {
  return useQuery({
    queryKey: ['organization', organizationId, 'reports', type, params],
    queryFn: () => organizationService.getReports(organizationId, type, params),
    enabled: !!organizationId,
  });
};

export const useOrganizationSettings = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization', organizationId, 'settings'],
    queryFn: () => organizationService.getSettings(organizationId),
    enabled: !!organizationId,
  });
};

export const useUpdateOrganizationSettings = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => organizationService.updateSettings(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organization', organizationId, 'settings'] 
      });
    },
  });
};