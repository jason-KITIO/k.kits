"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Trash2 } from "lucide-react";
import { useOrganizationSettings, useUpdateOrganizationSettings } from "@/hooks/use-organization-settings";
import { OrganizationImageUpload } from "./organization-image-upload";
import { OrganizationInfoForm } from "./organization/OrganizationInfoForm";
import { OrganizationPreferences } from "./organization/OrganizationPreferences";
import { OrganizationSystemInfo } from "./organization/OrganizationSystemInfo";

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
    await updateMutation.mutateAsync({ ...formData, settings });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <OrganizationInfoForm formData={formData} onChange={(data) => setFormData(data as any)} />
      <OrganizationImageUpload
        currentImage={formData.logo}
        onImageChange={(url) => setFormData({ ...formData, logo: url })}
        disabled={updateMutation.isPending}
      />
      <Separator />
      <OrganizationPreferences
        notifications={settings.notifications}
        onChange={(notifications) => setSettings({ ...settings, notifications })}
      />
      <Separator />
      <OrganizationSystemInfo organizationId={organizationId} />
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
