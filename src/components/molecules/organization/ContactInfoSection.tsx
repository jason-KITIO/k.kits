"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfoSectionProps {
  email: string;
  phone: string;
  address: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  disabled?: boolean;
}

export function ContactInfoSection({ email, phone, address, onEmailChange, onPhoneChange, onAddressChange, disabled }: ContactInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Informations de contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="contact@monentreprise.com" value={email} onChange={(e) => onEmailChange(e.target.value)} disabled={disabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" type="tel" placeholder="+237 698 765 432" value={phone} onChange={(e) => onPhoneChange(e.target.value)} disabled={disabled} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" placeholder="Logbessou, Douala, Cameroun" value={address} onChange={(e) => onAddressChange(e.target.value)} disabled={disabled} />
        </div>
      </CardContent>
    </Card>
  );
}
