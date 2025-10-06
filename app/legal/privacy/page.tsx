import { LegalLayout } from "@/components/templates/LegalLayout";
import { PrivacyContent } from "@/components/organisms/legal/PrivacyContent";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Politique de Confidentialité" lastUpdate="15 janvier 2024">
      <PrivacyContent />
    </LegalLayout>
  );
}
