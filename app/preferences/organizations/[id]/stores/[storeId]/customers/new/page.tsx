"use client";

import { useParams, useRouter } from "next/navigation";
import { useCreateCustomer } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "INDIVIDUAL" as "INDIVIDUAL" | "COMPANY" | "VIP",
  });

  const createCustomer = useCreateCustomer(organizationId, storeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCustomer.mutateAsync(formData);
      toast.success("Client créé avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores/${storeId}/customers`);
    } catch (error) {
      toast.error("Erreur lors de la création du client");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau client</h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau client à votre base
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informations du client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de client *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "INDIVIDUAL" | "COMPANY" | "VIP") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Particulier</SelectItem>
                  <SelectItem value="COMPANY">Entreprise</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Ex: jean.dupont@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ex: +33 1 23 45 67 89"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Ex: 123 Rue de la Paix, Paris"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createCustomer.isPending}>
                {createCustomer.isPending ? "Création..." : "Créer le client"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers`}>
                  Annuler
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}