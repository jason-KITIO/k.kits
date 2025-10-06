"use client";

import { ErrorLayout } from "@/components/templates/ErrorLayout";
import { AlertCircle } from "lucide-react";

export default function BadRequest() {
  return (
    <ErrorLayout
      code="400"
      title="Requête invalide"
      description="Les données envoyées sont incorrectes ou incomplètes."
      icon={AlertCircle}
      iconColor="bg-orange-100"
    />
  );
}
