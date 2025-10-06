"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-user-settings";
import { UpdateUserProfile } from "@/schema/user-settings.schema";
import { UserProfileSection } from "./user/UserProfileSection";
import { UserInfoForm } from "./user/UserInfoForm";
import { SecuritySection } from "./user/SecuritySection";
import { NotificationSettings } from "./user/NotificationSettings";
import { DisplaySettings } from "./user/DisplaySettings";

export function UserSettings() {
  const { data: user, isLoading } = useUserProfile();
  const updateMutation = useUpdateUserProfile();
  const [formData, setFormData] = useState<UpdateUserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    settings: {
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      display: {
        darkMode: false,
        language: "fr",
        timezone: "Europe/Paris",
      },
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        settings: {
          notifications: {
            email: user.settings?.notifications?.email ?? true,
            push: user.settings?.notifications?.push ?? false,
            sms: user.settings?.notifications?.sms ?? false,
          },
          display: {
            darkMode: user.settings?.display?.darkMode ?? false,
            language: user.settings?.display?.language ?? "fr",
            timezone: user.settings?.display?.timezone ?? "Europe/Paris",
          },
        },
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(formData);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNotificationChange = (type: "email" | "push" | "sms", value: boolean) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings!,
        notifications: { ...formData.settings!.notifications, [type]: value }
      }
    });
  };

  const handleDisplayChange = (field: "darkMode" | "language" | "timezone", value: boolean | string) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings!,
        display: { ...formData.settings!.display, [field]: value }
      }
    });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <UserProfileSection
        profileImageUrl={user?.profileImageUrl}
        firstName={user?.firstName}
        lastName={user?.lastName}
      />
      <Separator />
      <UserInfoForm
        firstName={formData.firstName || ""}
        lastName={formData.lastName || ""}
        email={formData.email || ""}
        phone={formData.phone || ""}
        onChange={handleFieldChange}
      />
      <Separator />
      <SecuritySection />
      <Separator />
      <NotificationSettings
        email={formData.settings?.notifications?.email ?? true}
        push={formData.settings?.notifications?.push ?? false}
        sms={formData.settings?.notifications?.sms ?? false}
        onChange={handleNotificationChange}
      />
      <Separator />
      <DisplaySettings
        darkMode={formData.settings?.display?.darkMode ?? false}
        language={formData.settings?.display?.language ?? "fr"}
        timezone={formData.settings?.display?.timezone ?? "Europe/Paris"}
        onChange={handleDisplayChange}
      />
      <Separator />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}