"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCloudinaryUpload } from "@/hooks/shared/useCloudinaryUpload";
import { GeneralInfoSection } from "@/components/molecules/organization/GeneralInfoSection";
import { DomainSection } from "@/components/molecules/organization/DomainSection";
import { LogoUploadSection } from "@/components/molecules/organization/LogoUploadSection";
import { ContactInfoSection } from "@/components/molecules/organization/ContactInfoSection";

interface OrganizationFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: any;
  mode: "create" | "edit";
  organizationId?: string;
}

export function OrganizationForm({ initialData, onSubmit, isLoading, error, mode, organizationId }: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    domain: initialData?.domain?.replace('.kkits.com', '') || "",
    logo: initialData?.logo || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    active: initialData?.active ?? true,
  });

  const { upload, uploading } = useCloudinaryUpload();
  const domainManuallyEdited = useRef(false);

  useEffect(() => {
    if (domainManuallyEdited.current || !formData.name.trim()) return;
    const subdomain = formData.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setFormData(prev => ({ ...prev, domain: subdomain }));
  }, [formData.name]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = await upload(e.target.files[0]);
    if (url) setFormData(prev => ({ ...prev, logo: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domainFull = formData.domain.trim() ? `${formData.domain.trim().toLowerCase()}.kkits.com` : undefined;
    onSubmit({ ...formData, domain: domainFull });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <GeneralInfoSection name={formData.name} description={formData.description} 
        onNameChange={(v) => setFormData(p => ({ ...p, name: v }))}
        onDescriptionChange={(v) => setFormData(p => ({ ...p, description: v }))}
        disabled={isLoading} />

      <div className="grid gap-8 lg:grid-cols-2">
        <DomainSection domain={formData.domain} 
          onDomainChange={(v) => { domainManuallyEdited.current = true; setFormData(p => ({ ...p, domain: v })); }}
          disabled={isLoading} />
        <LogoUploadSection logo={formData.logo} uploading={uploading} onFileChange={handleImageChange} disabled={isLoading} />
      </div>

      <ContactInfoSection email={formData.email} phone={formData.phone} address={formData.address}
        onEmailChange={(v) => setFormData(p => ({ ...p, email: v }))}
        onPhoneChange={(v) => setFormData(p => ({ ...p, phone: v }))}
        onAddressChange={(v) => setFormData(p => ({ ...p, address: v }))}
        disabled={isLoading} />

      {error && <Alert variant="destructive"><AlertDescription>{error.message}</AlertDescription></Alert>}

      <div className="flex gap-4 pt-6">
        <Button type="button" variant="outline" className="flex-1" asChild>
          <Link href={mode === "edit" && organizationId ? `/preferences/organizations/${organizationId}` : "/preferences/organizations"}>Annuler</Link>
        </Button>
        <Button type="submit" disabled={isLoading || uploading} className="flex-1">
          {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{mode === "edit" ? "Modification..." : "Création..."}</> : 
            <><Building2 className="h-4 w-4 mr-2" />{mode === "edit" ? "Modifier" : "Créer"} l'organisation</>}
        </Button>
      </div>
    </form>
  );
}
