import RegisterVerificationPage from "@/components/auth/register/verification/register-verification-page";
import { Suspense } from "react";

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RegisterVerificationPage />
    </Suspense>
  );
}
