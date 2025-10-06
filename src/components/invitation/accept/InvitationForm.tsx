"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface InvitationFormProps {
  email: string;
  formData: FormData;
  onChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function InvitationForm({ email, formData, onChange, onSubmit, isSubmitting }: InvitationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled className="bg-muted" />
      </div>

      <div>
        <Label htmlFor="firstName">Prénom *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onChange({ ...formData, password: e.target.value })}
          required
          minLength={6}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => onChange({ ...formData, confirmPassword: e.target.value })}
          required
          minLength={6}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Création du compte...
          </>
        ) : (
          "Créer mon compte et rejoindre"
        )}
      </Button>
    </form>
  );
}
