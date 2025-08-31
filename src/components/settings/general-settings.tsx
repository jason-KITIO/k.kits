"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useOrganizationSettings, useUpdateOrganizationSettings } from "@/hooks/use-settings";
import { toast } from "sonner";
import { Settings } from "lucide-react";

interface GeneralSettingsProps {
  organizationId: string;
}

export function GeneralSettings({ organizationId }: GeneralSettingsProps) {
  const { data: settings, isLoading } = useOrganizationSettings(organizationId);
  const updateMutation = useUpdateOrganizationSettings(organizationId);

  const [formData, setFormData] = useState({
    timezone: "UTC",
    currency: "FCFA",
    language: "fr",
    dateFormat: "DD/MM/YYYY",
    lowStockThreshold: 10,
    autoReorderEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        timezone: settings.timezone,
        currency: settings.currency,
        language: settings.language,
        dateFormat: settings.dateFormat,
        lowStockThreshold: settings.lowStockThreshold,
        autoReorderEnabled: settings.autoReorderEnabled,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Paramètres mis à jour avec succès");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (isLoading) return <div>Chargement des paramètres...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres généraux</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Préférences système</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Africa/Douala">Afrique/Douala</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCFA">FCFA</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Langue</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateFormat">Format de date</Label>
                <Select value={formData.dateFormat} onValueChange={(value) => setFormData({ ...formData, dateFormat: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestion du stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lowStockThreshold">Seuil de stock bas par défaut</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoReorder">Réapprovisionnement automatique</Label>
                <p className="text-sm text-muted-foreground">Créer automatiquement des commandes d&apos;achat</p>
              </div>
              <Switch
                id="autoReorder"
                checked={formData.autoReorderEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, autoReorderEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">Notifications par SMS</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes par SMS</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={formData.smsNotifications}
                onCheckedChange={(checked) => setFormData({ ...formData, smsNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateMutation.isPending} className="w-full">
          {updateMutation.isPending ? "Mise à jour..." : "Enregistrer les paramètres"}
        </Button>
      </form>
    </div>
  );
}