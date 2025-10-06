"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface GeneralInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  disabled?: boolean;
}

export function GeneralInfoSection({ name, description, onNameChange, onDescriptionChange, disabled }: GeneralInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'organisation *</Label>
          <Input id="name" placeholder="Mon Entreprise" value={name} onChange={(e) => onNameChange(e.target.value)} required disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Décrivez votre organisation..." value={description} onChange={(e) => onDescriptionChange(e.target.value)} rows={4} disabled={disabled} />
        </div>
      </CardContent>
    </Card>
  );
}
