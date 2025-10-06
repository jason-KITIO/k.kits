"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStore, useUpdateStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoreEditLoadingSkeleton } from "@/components/pages/store-edit/StoreEditLoadingSkeleton";
import { StoreFormCard } from "@/components/pages/store-form/StoreFormCard";
import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function EditStorePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  const isDuplicate = searchParams.get('duplicate') === 'true';
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    type: "PHYSICAL" as "PHYSICAL" | "ONLINE" | "HYBRID",
  });

  const { data: store, isLoading } = useStore(organizationId, storeId);
  const updateStore = useUpdateStore();

  useEffect(() => {
    if (store) {
      setFormData({
        name: isDuplicate ? `${store.name} (Copie)` : store.name,
        address: store.address || "",
        phone: store.phone || "",
        type: store.type as "PHYSICAL" | "ONLINE" | "HYBRID",
      });
    }
  }, [store, isDuplicate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateStore.mutateAsync({
        organizationId,
        storeId,
        data: formData,
      });
      
      toast.success("Boutique modifiée avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores`);
    } catch (error) {
      toast.error("Erreur lors de la modification de la boutique");
    }
  };

  if (isLoading) return <StoreEditLoadingSkeleton />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isDuplicate ? "Dupliquer la boutique" : "Modifier la boutique"}
          </h1>
          <p className="text-muted-foreground">
            {isDuplicate ? "Créer une copie de la boutique" : "Modifiez les informations de la boutique"}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Informations de la boutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la boutique *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Boutique Centre-Ville"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de boutique *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "PHYSICAL" | "ONLINE" | "HYBRID") => 
                  setFormData(prev => ({ ...prev, type: value }))
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
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Ex: 123 Rue de la Paix, Paris"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ex: +237 698 765 432"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={updateStore.isPending}>
                {updateStore.isPending ? "Enregistrement..." : "Enregistrer"}
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
    </div>
  );
}