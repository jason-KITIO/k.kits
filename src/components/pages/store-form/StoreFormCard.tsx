import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import Link from "next/link";

interface StoreFormData {
  name: string;
  address: string;
  phone: string;
  type: "PHYSICAL" | "ONLINE" | "HYBRID";
  active: boolean;
}

interface StoreFormCardProps {
  formData: StoreFormData;
  onFormDataChange: (data: StoreFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  organizationId: string;
}

export function StoreFormCard({ formData, onFormDataChange, onSubmit, isSubmitting, organizationId }: StoreFormCardProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Informations de la boutique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la boutique *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Ex: Boutique Centre-Ville"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de boutique *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "PHYSICAL" | "ONLINE" | "HYBRID") => 
                onFormDataChange({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHYSICAL">Physique</SelectItem>
                <SelectItem value="ONLINE">En ligne</SelectItem>
                <SelectItem value="HYBRID">Hybride</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
              placeholder="Ex: 123 Rue de la Paix, Paris"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              placeholder="Ex: +237 698 765 432"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la boutique"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/preferences/organizations/${organizationId}/stores`}>
                Annuler
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
