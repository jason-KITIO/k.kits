"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { SettingsPageHeader } from "@/components/pages/settings/SettingsPageHeader";
import { SettingsTabsList } from "@/components/pages/settings/SettingsTabsList";
import { SettingsTabContent } from "@/components/pages/settings/SettingsTabContent";

export default function SettingsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [activeTab, setActiveTab] = useState("organization");

  return (
    <div className="space-y-6 p-6">
      <SettingsPageHeader />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <SettingsTabsList />
        <SettingsTabContent organizationId={organizationId} />
      </Tabs>
    </div>
  );
}
