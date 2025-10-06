"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function InvalidInvitation() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">Invitation invalide</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cette invitation a expiré ou n'est plus valide.
              </p>
            </div>
            <Button onClick={() => router.push("/login")}>Retour à la connexion</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
