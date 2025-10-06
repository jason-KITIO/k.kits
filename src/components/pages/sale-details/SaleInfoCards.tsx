import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, User } from "lucide-react";

interface SaleInfoCardsProps {
  sale: any;
}

export function SaleInfoCards({ sale }: SaleInfoCardsProps) {
  return (
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
  );
}
