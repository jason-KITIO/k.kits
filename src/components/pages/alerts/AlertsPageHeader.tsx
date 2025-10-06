import { Bell } from "lucide-react";

export function AlertsPageHeader() {
  return (
    <div className="border-b border-border/50 pb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes & Notifications</h1>
          <p className="text-muted-foreground mt-1">Gérez vos notifications et alertes de stock en temps réel</p>
        </div>
      </div>
    </div>
  );
}
