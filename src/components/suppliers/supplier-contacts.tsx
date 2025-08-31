"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuppliers } from "@/hooks/use-purchases";
import { Mail, Phone, User, Building } from "lucide-react";

interface SupplierContactsProps {
  organizationId: string;
}

export function SupplierContacts({ organizationId }: SupplierContactsProps) {
  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);

  const suppliersWithContacts = suppliers.filter(
    (s) => s.email || s.phone || s.contactPerson
  );

  if (isLoading) return <div>Chargement des contacts...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Contacts fournisseurs</h2>

      {suppliersWithContacts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun contact disponible</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {suppliersWithContacts.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>{supplier.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.contactPerson && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{supplier.contactPerson}</p>
                      <p className="text-sm text-muted-foreground">
                        Personne de contact
                      </p>
                    </div>
                  </div>
                )}

                {supplier.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{supplier.email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                )}

                {supplier.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{supplier.phone}</p>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                    </div>
                  </div>
                )}

                {supplier.paymentTerms && (
                  <div className="text-sm">
                    <span className="font-medium">Conditions de paiement:</span>{" "}
                    {supplier.paymentTerms}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
