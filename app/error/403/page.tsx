"use client";

import { ErrorLayout } from "@/components/templates/ErrorLayout";
import { ShieldX } from "lucide-react";

export default function Forbidden() {
  return (
    <ErrorLayout
      code="403"
      title="Accès interdit"
      description="Vous n'avez pas les permissions nécessaires pour accéder à cette ressource."
      icon={ShieldX}
      iconColor="bg-red-100"
    />
  );
}
