"use client";

import { ErrorLayout } from "@/components/templates/ErrorLayout";
import { ServerCrash } from "lucide-react";

export default function InternalServerError() {
  return (
    <ErrorLayout
      code="500"
      title="Erreur serveur"
      description="Une erreur interne s'est produite. Nos équipes ont été notifiées."
      icon={ServerCrash}
      iconColor="bg-red-100"
      showRefresh
    />
  );
}
