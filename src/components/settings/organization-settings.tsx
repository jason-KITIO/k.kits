"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2 } from "lucide-react";
import { useOrganizationSettings, useUpdateOrganizationSettings } from "@/hooks/use-organization-settings";
import { OrganizationSettingsUpdate } from "@/schema/organization-settings.schema";
import { OrganizationImageUpload } from "./organization-image-upload";

interface OrganizationSettingsProps {
  organizationId: string;
}

export function OrganizationSettings({ organizationId }: OrganizationSettingsProps) {
  const { data: organization, isLoading } = useOrganizationSettings(organizationId);
  const updateMutation = useUpdateOrganizationSettings(organizationId);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    domain: "",
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      stockAlerts: true,
      weeklyReports: false,
    },
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        description: organization.description || "",
        email: organization.email || "",
        phone: organization.phone || "",
        address: organization.address || "",
        logo: organization.logo || "",
        domain: organization.domain || "",
      });
      if (organization.settings) {
        setSettings({
          notifications: organization.settings.notifications || settings.notifications,
        });
      }
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      ...formData,
      settings,
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="org-name">Nom de l'organisation</Label>
          <Input 
            id="org-name" 
            placeholder="Mon entreprise" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="org-description">Description</Label>
          <Textarea 
            id="org-description" 
            placeholder="Description de votre organisation"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="org-email">Email de contact</Label>
            <Input 
              id="org-email" 
              type="email" 
              placeholder="contact@entreprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org-phone">Téléphone</Label>
            <Input 
              id="org-phone" 
              placeholder="+33 1 23 45 67 89"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="org-address">Adresse</Label>
          <Textarea 
            id="org-address" 
            placeholder="Adresse complète"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="org-domain">Domaine</Label>
          <div className="flex items-center">
            <Input 
              id="org-domain" 
              placeholder="mon-entreprise"
              value={formData.domain?.replace('.kkits.com', '') || ''}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value ? `${e.target.value}.kkits.com` : '' })}
              className="rounded-r-none"
            />
            <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
              .kkits.com
            </div>
          </div>
        </div>

        <OrganizationImageUpload
          currentImage={formData.logo}
          onImageChange={(url) => setFormData({ ...formData, logo: url })}
          disabled={updateMutation.isPending}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Préférences</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications par email</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir les notifications importantes par email
            </p>
          </div>
          <Switch 
            checked={settings.notifications?.email}
            onCheckedChange={(checked) => 
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: checked }
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Alertes de stock automatiques</Label>
            <p className="text-sm text-muted-foreground">
              Notifications automatiques pour les stocks bas
            </p>
          </div>
          <Switch 
            checked={settings.notifications?.stockAlerts}
            onCheckedChange={(checked) => 
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, stockAlerts: checked }
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Rapports hebdomadaires</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir un résumé hebdomadaire des activités
            </p>
          </div>
          <Switch 
            checked={settings.notifications?.weeklyReports}
            onCheckedChange={(checked) => 
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, weeklyReports: checked }
              })
            }
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations système</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">ID Organisation</Label>
            <p className="font-mono">{organizationId}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Plan actuel</Label>
            <Badge variant="default">Premium</Badge>
          </div>
          <div>
            <Label className="text-muted-foreground">Créée le</Label>
            <p>15 janvier 2024</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Dernière modification</Label>
            <p>Il y a 2 jours</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer l'organisation
        </Button>
        
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}