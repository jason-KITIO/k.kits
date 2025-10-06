"use client";

import { ErrorLayout } from "@/components/templates/ErrorLayout";
import { Construction } from "lucide-react";

export default function ServiceUnavailable() {
  return (
    <ErrorLayout
      code="503"
      title="Service indisponible"
      description="Le service est temporairement indisponible. Maintenance en cours."
      icon={Construction}
      iconColor="bg-yellow-100"
      showRefresh
    />
  );
}
