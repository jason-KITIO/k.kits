"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  email: boolean;
  push: boolean;
  sms: boolean;
  onChange: (type: "email" | "push" | "sms", value: boolean) => void;
}

export function NotificationSettings({ email, push, sms, onChange }: NotificationSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Préférences de notification</h3>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Notifications par email</Label>
          <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
        </div>
        <Switch checked={email} onCheckedChange={(checked) => onChange("email", checked)} />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Notifications push</Label>
          <p className="text-sm text-muted-foreground">Recevoir les notifications dans le navigateur</p>
        </div>
        <Switch checked={push} onCheckedChange={(checked) => onChange("push", checked)} />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Notifications SMS</Label>
          <p className="text-sm text-muted-foreground">Recevoir les alertes importantes par SMS</p>
        </div>
        <Switch checked={sms} onCheckedChange={(checked) => onChange("sms", checked)} />
      </div>
    </div>
  );
}
