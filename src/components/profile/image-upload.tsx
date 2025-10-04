"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, User } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ currentImage, onImageChange, disabled }: ImageUploadProps) {
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
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentImage} />
        <AvatarFallback>
          <User className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled || uploading}
          className="mb-2"
        />
        {uploading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Upload en cours...
          </p>
        )}
      </div>
    </div>
  );
}