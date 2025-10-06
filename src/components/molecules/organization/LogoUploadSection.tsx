"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Loader2 } from "lucide-react";

interface LogoUploadSectionProps {
  logo: string;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function LogoUploadSection({ logo, uploading, onFileChange, disabled }: LogoUploadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logoFile">Fichier image</Label>
          <div className="flex items-center gap-4">
            <Input id="logoFile" type="file" accept="image/*" onChange={onFileChange} disabled={disabled || uploading} className="flex-1" />
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          {logo && <img src={logo} alt="Logo" className="h-20 w-20 object-cover rounded-lg border shadow-sm mt-4" />}
        </div>
      </CardContent>
    </Card>
  );
}
