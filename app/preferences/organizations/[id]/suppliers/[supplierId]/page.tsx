"use client";

import { useParams } from "next/navigation";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, CreditCard, Calendar, MapPin, FileText } from "lucide-react";
import { SupplierDetailsHeader } from "@/components/pages/supplier-details/SupplierDetailsHeader";
import { SupplierInfoCards } from "@/components/pages/supplier-details/SupplierInfoCards";

export default function SupplierDetailsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const supplierId = params.supplierId as string;
  
  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);
  const supplier = suppliers.find(s => s.id === supplierId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-5 w-32 mt-2" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (!supplier) return <div>Fournisseur non trouvé</div>;

  return (
    <div className="space-y-6 p-6">
      <SupplierDetailsHeader organizationId={organizationId} supplierId={supplierId} supplier={supplier} />

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
    </div>
  );
}