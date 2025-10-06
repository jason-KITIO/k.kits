"use client";

import { ErrorLayout } from "@/components/templates/ErrorLayout";
import { Lock } from "lucide-react";

export default function Unauthorized() {
  return (
    <ErrorLayout
      code="401"
      title="Non autorisé"
      description="Vous devez vous connecter pour accéder à cette page."
      icon={Lock}
      iconColor="bg-red-100"
      showLogin
    />
  );
}
