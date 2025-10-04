import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService, type Supplier } from "@/services/supplierService";
import { SupplierCreateInput } from "@/schema/supplier.schema";
import { toast } from "sonner";

export function useSuppliers(organizationId: string) {
  return useQuery({
    queryKey: ["suppliers", organizationId],
    queryFn: () => supplierService.getAll(organizationId),
    enabled: !!organizationId,
  });
}

export function useCreateSupplier(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SupplierCreateInput) => supplierService.create(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", organizationId] });
      toast.success("Fournisseur créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du fournisseur");
    },
  });
}

export function useUpdateSupplier(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierCreateInput> }) => 
      supplierService.update(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", organizationId] });
      toast.success("Fournisseur mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du fournisseur");
    },
  });
}

export function useDeleteSupplier(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => supplierService.delete(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", organizationId] });
      toast.success("Fournisseur supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du fournisseur");
    },
  });
}