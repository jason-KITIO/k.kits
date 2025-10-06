"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useValidateInvitation } from "@/hooks/use-invitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { InvitationForm } from "./accept/InvitationForm";
import { InvalidInvitation } from "./accept/InvalidInvitation";
import { useInvitationAccept } from "./accept/useInvitationAccept";

function InvitationAcceptContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const { data: invitation, isLoading, error } = useValidateInvitation(token || "");
  const { isSubmitting, handleSubmit } = useInvitationAccept(token, (invitation as any)?.email);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Validation de l'invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !(invitation as any)?.valid) {
    return <InvalidInvitation />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-xl">Accepter l'invitation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Vous êtes invité à rejoindre <strong>{(invitation as any).organizationName}</strong> en tant que{" "}
            <strong>{(invitation as any).roleName}</strong>
          </p>
        </CardHeader>
        <CardContent>
          <InvitationForm
            email={(invitation as any).email}
            formData={formData}
            onChange={setFormData}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function InvitationAccept() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <InvitationAcceptContent />
    </Suspense>
  );
}
