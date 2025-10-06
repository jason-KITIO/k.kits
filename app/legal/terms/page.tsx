import { LegalLayout } from "@/components/templates/LegalLayout";
import { TermsContent } from "@/components/organisms/legal/TermsContent";

export default function TermsPage() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation" lastUpdate="15 janvier 2024">
      <TermsContent />
    </LegalLayout>
  );
}
