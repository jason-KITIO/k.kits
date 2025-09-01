"use client";

import { VerificationResultPage } from "@/components/auth/register/verification/verification-result";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setSuccess(false);
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          `/api/auth/email/verify?token=${encodeURIComponent(token!)}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.message === "Email vérifié avec succès") {
            setSuccess(true);
          } else {
            setSuccess(false);
          }
        } else {
          setSuccess(false);
        }
      } catch {
        setSuccess(false);
      }
    }

    verifyEmail();
  }, [token]);

  if (success === null) {
    return <div>Chargement...</div>;
  }

  return <VerificationResultPage success={success} redirectTo="/login" />;
}
