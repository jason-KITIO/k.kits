"use client";

import { useParams } from "next/navigation";
import { useOptimizedQuery } from "@/hooks/use-optimized-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Receipt, User } from "lucide-react";
import { SaleDetailsHeader } from "@/components/pages/sale-details/SaleDetailsHeader";
import { SaleInfoCards } from "@/components/pages/sale-details/SaleInfoCards";

export default function SaleDetailsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  const saleId = params.saleId as string;

  const { data: sale, isLoading } = useOptimizedQuery({
    queryKey: ["sale-details", organizationId, storeId, saleId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/stores/${storeId}/sales/${saleId}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Erreur lors de la récupération de la vente");
      return response.json();
    },
    enabled: !!organizationId && !!storeId && !!saleId,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!sale) return <div>Vente non trouvée</div>;

  return (
    <div className="space-y-6 p-6">
      <SaleDetailsHeader organizationId={organizationId} storeId={storeId} saleId={sale.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Boutique :</span>
              <span>{sale.store.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date :</span>
              <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendeur :</span>
              <span>{sale.user.username || `${sale.user.firstName} ${sale.user.lastName}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut :</span>
              <span className={`px-2 py-1 rounded text-sm ${
                sale.status === 'PAID' ? 'bg-green-100 text-green-800' :
                sale.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sale.status === 'PAID' ? 'Payé' : 
                 sale.status === 'PENDING' ? 'En attente' : 'Annulé'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sale.customer ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nom :</span>
                  <span>{sale.customer.name}</span>
                </div>
                {sale.customer.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email :</span>
                    <span>{sale.customer.email}</span>
                  </div>
                )}
                {sale.customer.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Téléphone :</span>
                    <span>{sale.customer.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Client de passage</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles vendus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sale.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.quantity} × {Number(item.unitPrice).toLocaleString()} FCFA
                  </p>
                  {item.discount > 0 && (
                    <p className="text-sm text-red-600">-{item.discount}%</p>
                  )}
                  <p className="text-lg font-bold">
                    {Number(item.totalAmount).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Résumé financier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total :</span>
              <span>{Number(sale.totalAmount).toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Montant payé :</span>
              <span>{Number(sale.paidAmount).toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}