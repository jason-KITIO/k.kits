import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, CreditCard, Calendar, MapPin, FileText } from "lucide-react";

interface SupplierInfoCardsProps {
  supplier: any;
}

export function SupplierInfoCards({ supplier }: SupplierInfoCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nom</label>
            <p className="text-sm">{supplier.name}</p>
          </div>
          {supplier.contactPerson && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Personne de contact</label>
              <p className="text-sm">{supplier.contactPerson}</p>
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{supplier.email}</p>
              </div>
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                <p className="text-sm">{supplier.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informations commerciales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supplier.taxNumber && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Numéro fiscal</label>
              <p className="text-sm">{supplier.taxNumber}</p>
            </div>
          )}
          {supplier.paymentTerms && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Conditions de paiement</label>
              <p className="text-sm">{supplier.paymentTerms}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Créé le</label>
              <p className="text-sm">{new Date(supplier.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {supplier.address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{supplier.address}</p>
          </CardContent>
        </Card>
      )}

      {supplier.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{supplier.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
