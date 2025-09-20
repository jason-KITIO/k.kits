"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApproveStockMovementRequest } from "@/hooks/use-stock-movement-requests";
import { stockMovementRequestApprovalSchema } from "@/schema/stock-movement-request.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StockMovementRequestWithRelations, StockMovementRequestApproval } from "@/types/stock-movement-request";

interface ApprovalDialogProps {
  organizationId: string;
  storeId: string;
  request: StockMovementRequestWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApprovalDialog({
  organizationId,
  storeId,
  request,
  open,
  onOpenChange,
}: ApprovalDialogProps) {
  const form = useForm<StockMovementRequestApproval>({
    resolver: zodResolver(stockMovementRequestApprovalSchema),
    defaultValues: {
      status: "APPROVED",
    },
  });

  const approveRequest = useApproveStockMovementRequest(organizationId, storeId);
  const watchStatus = form.watch("status");

  const onSubmit = (data: StockMovementRequestApproval) => {
    // Validation: si rejet, la raison est obligatoire
    if (data.status === "REJECTED" && !data.rejectionReason?.trim()) {
      form.setError("rejectionReason", {
        message: "La raison du refus est obligatoire"
      });
      return;
    }
    
    approveRequest.mutate(
      { requestId: request.id, data },
      {
        onSuccess: () => {
          form.reset({
            status: "APPROVED",
          });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Valider ou Refuser la Demande</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium mb-3 text-blue-900">Résumé de la demande</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Produit :</span>
              <span className="text-sm">{request.product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Quantité :</span>
              <span className="text-sm font-bold text-blue-600">{request.quantity} articles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Transfert :</span>
              <span className="text-sm">{request.fromType} → {request.toType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Demandé par :</span>
              <span className="text-sm">{request.requester.firstName} {request.requester.lastName}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm font-medium mb-1">Motif :</p>
            <p className="text-sm text-blue-800">{request.reason}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="approvedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qui valide cette demande ?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le responsable..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mgr1">Pierre Durand (Gérant)</SelectItem>
                      <SelectItem value="mgr2">Anne Martin (Responsable Stock)</SelectItem>
                      <SelectItem value="mgr3">Marc Dubois (Superviseur)</SelectItem>
                      <SelectItem value="mgr4">Claire Rousseau (Directrice)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre décision</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APPROVED">✓ Accepter la demande</SelectItem>
                      <SelectItem value="REJECTED">✗ Refuser la demande</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchStatus === "REJECTED" && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name="rejectionReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-800">Pourquoi refuser cette demande ? *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Stock insuffisant, priorité à d'autres ventes, produit en promotion..." 
                          className="bg-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={approveRequest.isPending}>
                {approveRequest.isPending ? "Enregistrement..." : "Valider ma décision"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}