"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  domain: string;
}

interface OrganizationInfoFormProps {
  formData: FormData;
  onChange: (data: FormData) => void;
}

export function OrganizationInfoForm({ formData, onChange }: OrganizationInfoFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="org-name">Nom de l'organisation</Label>
        <Input
          id="org-name"
          placeholder="Mon entreprise"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="org-description">Description</Label>
        <Textarea
          id="org-description"
          placeholder="Description de votre organisation"
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="org-email">Email de contact</Label>
          <Input
            id="org-email"
            type="email"
            placeholder="contact@entreprise.com"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="org-phone">Téléphone</Label>
          <Input
            id="org-phone"
            placeholder="+33 1 23 45 67 89"
            value={formData.phone}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="org-address">Adresse</Label>
        <Textarea
          id="org-address"
          placeholder="Adresse complète"
          value={formData.address}
          onChange={(e) => onChange({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="org-domain">Domaine</Label>
        <div className="flex items-center">
          <Input
            id="org-domain"
            placeholder="mon-entreprise"
            value={formData.domain?.replace('.kkits.com', '') || ''}
            onChange={(e) => onChange({ ...formData, domain: e.target.value ? `${e.target.value}.kkits.com` : '' })}
            className="rounded-r-none"
          />
          <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
            .kkits.com
          </div>
        </div>
      </div>
    </div>
  );
}
