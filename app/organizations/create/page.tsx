"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function OrganizationCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Garde la trace si domaine a été modifié manuellement
  const domainManuallyEdited = useRef(false);

  // Mise à jour automatique du domaine si nom change et domaine pas modifié manuellement
  useEffect(() => {
    if (domainManuallyEdited.current) return;

    if (formData.name.trim() === "") {
      setFormData((prev) => ({ ...prev, domain: "" }));
      return;
    }
    const subdomain = formData.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setFormData((prev) => ({ ...prev, domain: subdomain }));
  }, [formData.name]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;

    if (id === "domain") {
      domainManuallyEdited.current = true; // marque qu'on a édité domaine manuellement
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);
    setError(null);

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, logo: data.secure_url }));
      } else {
        setError("Erreur lors de l'upload de l'image");
      }
    } catch (err) {
      console.error("Upload image error", err);
      setError("Erreur lors de l'upload de l'image, veuillez réessayer");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let domainFull: string | undefined = undefined;
    if (formData.domain && formData.domain.trim() !== "") {
      domainFull = `${formData.domain.trim().toLowerCase()}.kkits.com`;
    }

    const payload = {
      ...formData,
      domain: domainFull,
      active: true,
    };

    try {
      const res = await fetch("/api/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Erreur lors de la création");
      }

      router.push("/organizations");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("max-w-3xl mx-auto p-6")}>
      <h1 className="text-2xl font-bold mb-6">
        Créer une nouvelle organisation
      </h1>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nom de l'organisation *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Mon Entreprise"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Une entreprise innovante"
            value={formData.description}
            onChange={handleChange}
            className="resize-none rounded border border-input px-3 py-2 text-base"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="domain">Domaine</Label>
            <div className="flex items-end space-x-2">
              <Input
                id="domain"
                type="text"
                placeholder="john-team"
                value={formData.domain}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span>.kkits.com</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="logoFile">Logo de l'organisation</Label>
            <Input
              id="logoFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting || uploading}
              className="border rounded px-3 py-2 w-full"
            />
            {uploading && (
              <p className="text-sm text-muted-foreground mt-1">Upload en cours...</p>
            )}
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Logo uploadé"
                className="mt-3 h-24 w-auto rounded shadow"
              />
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Rue de la Paix, Paris"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+237 698 765 432"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@monentreprise.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {error && <p className="text-destructive text-center">{error}</p>}

        <Button
          type="submit"
          disabled={isSubmitting || uploading}
          className="w-full"
        >
          {isSubmitting ? "Création en cours..." : "Créer l'organisation"}
        </Button>
      </form>
    </div>
  );
}
