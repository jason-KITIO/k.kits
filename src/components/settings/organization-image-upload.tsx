"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Building2 } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface OrganizationImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

export function OrganizationImageUpload({ 
  currentImage, 
  onImageChange, 
  disabled 
}: OrganizationImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        onImageChange(data.secure_url);
      }
    } catch (err) {
      console.error("Upload image error", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="logoFile">Logo de l'organisation</Label>
        <Input
          id="logoFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled || uploading}
        />
        {uploading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Upload en cours...
          </p>
        )}
      </div>
      
      {currentImage ? (
        <div className="flex items-center gap-4">
          <img
            src={currentImage}
            alt="Logo de l'organisation"
            className="h-16 w-16 object-cover rounded-lg border shadow-sm"
          />
          <div className="text-sm text-muted-foreground">
            Logo actuel
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-muted rounded-lg border flex items-center justify-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">
            Aucun logo défini
          </div>
        </div>
      )}
    </div>
  );
}