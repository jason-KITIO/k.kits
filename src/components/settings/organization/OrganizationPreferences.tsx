"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  email: boolean;
  stockAlerts: boolean;
  weeklyReports: boolean;
}

interface OrganizationPreferencesProps {
  notifications: NotificationSettings;
  onChange: (notifications: NotificationSettings) => void;
}

export function OrganizationPreferences({ notifications, onChange }: OrganizationPreferencesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Préférences</h3>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Notifications par email</Label>
          <p className="text-sm text-muted-foreground">Recevoir les notifications importantes par email</p>
        </div>
        <Switch
          checked={notifications.email}
          onCheckedChange={(checked) => onChange({ ...notifications, email: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Alertes de stock automatiques</Label>
          <p className="text-sm text-muted-foreground">Notifications automatiques pour les stocks bas</p>
        </div>
        <Switch
          checked={notifications.stockAlerts}
          onCheckedChange={(checked) => onChange({ ...notifications, stockAlerts: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Rapports hebdomadaires</Label>
          <p className="text-sm text-muted-foreground">Recevoir un résumé hebdomadaire des activités</p>
        </div>
        <Switch
          checked={notifications.weeklyReports}
          onCheckedChange={(checked) => onChange({ ...notifications, weeklyReports: checked })}
        />
      </div>
    </div>
  );
}
