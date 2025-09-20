import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeStockService } from "@/services/employee-stock-service";
import { toast } from "sonner";
import type { EmployeeStockCreateInput, EmployeeStockUpdateInput } from "@/schema/employee-stock.schema";

export const useEmployeeStocks = (organizationId: string, storeId: string, employeeId?: string) => {
  return useQuery({
    queryKey: ["employee-stocks", organizationId, storeId, employeeId],
    queryFn: () => employeeStockService.getByStore(organizationId, storeId, employeeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useEmployeeStock = (organizationId: string, storeId: string, employeeStockId: string) => {
  return useQuery({
    queryKey: ["employee-stock", organizationId, storeId, employeeStockId],
    queryFn: () => employeeStockService.getById(organizationId, storeId, employeeStockId),
    enabled: !!organizationId && !!storeId && !!employeeStockId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateEmployeeStock = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EmployeeStockCreateInput) => 
      employeeStockService.create(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-stocks", organizationId, storeId] });
      toast.success("Stock employé créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEmployeeStock = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeStockId, data }: { employeeStockId: string; data: EmployeeStockUpdateInput }) =>
      employeeStockService.update(organizationId, storeId, employeeStockId, data),
    onSuccess: (_, { employeeStockId }) => {
      queryClient.invalidateQueries({ queryKey: ["employee-stocks", organizationId, storeId] });
      queryClient.invalidateQueries({ queryKey: ["employee-stock", organizationId, storeId, employeeStockId] });
      toast.success("Stock employé modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteEmployeeStock = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (employeeStockId: string) => 
      employeeStockService.delete(organizationId, storeId, employeeStockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-stocks", organizationId, storeId] });
      toast.success("Stock employé supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};