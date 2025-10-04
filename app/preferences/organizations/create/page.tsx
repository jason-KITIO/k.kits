"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Upload,
  Loader2,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  MapPin,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useCreateOrganization } from "@/hooks/use-organizations";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function OrganizationCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createOrganization = useCreateOrganization();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    active: true,
  });

  const [uploading, setUploading] = useState(false);
  const domainManuallyEdited = useRef(false);

  // Gérer la duplication
  useEffect(() => {
    const duplicateData = searchParams.get('duplicate');
    if (duplicateData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(duplicateData));
        setFormData(parsedData);
        domainManuallyEdited.current = true;
      } catch (error) {
        console.error('Erreur lors du parsing des données de duplication:', error);
      }
    }
  }, [searchParams]);

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
      domainManuallyEdited.current = true;
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
      }
    } catch (err) {
      console.error("Upload image error", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let domainFull: string | undefined = undefined;
    if (formData.domain && formData.domain.trim() !== "") {
      domainFull = `${formData.domain.trim().toLowerCase()}.kkits.com`;
    }

    const payload = {
      ...formData,
      domain: domainFull,
      active: formData.active ?? true,
    };

    createOrganization.mutate(payload, {
      onSuccess: () => {
        router.push("/preferences/organizations");
      }
    });
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/preferences/organizations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Créer une nouvelle organisation
            </h1>
            <p className="text-muted-foreground mt-1">
              Configurez votre organisation pour commencer à gérer votre
              inventaire
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations générales
            </CardTitle>
            <CardDescription>
              Définissez les informations de base de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l&apos;organisation *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Mon Entreprise"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={createOrganization.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre organisation et son activité..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={createOrganization.isPending}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domaine web
              </CardTitle>
              <CardDescription>
                Votre adresse web personnalisée (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Sous-domaine</Label>
                <div className="flex items-center">
                  <Input
                    id="domain"
                    type="text"
                    placeholder="mon-entreprise"
                    value={formData.domain}
                    onChange={handleChange}
                    disabled={createOrganization.isPending}
                    className="rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .kkits.com
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Généré automatiquement à partir du nom
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo
              </CardTitle>
              <CardDescription>
                Ajoutez le logo de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoFile">Fichier image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={createOrganization.isPending || uploading}
                    className="flex-1"
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {uploading && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload en cours...
                  </p>
                )}
                {formData.logo && (
                  <div className="mt-4">
                    <img
                      src={formData.logo}
                      alt="Logo uploadé"
                      className="h-20 w-20 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Informations de contact
            </CardTitle>
            <CardDescription>
              Coordonnées de votre organisation (optionnel)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@monentreprise.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={createOrganization.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+237 698 765 432"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={createOrganization.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Logbessou, Douala, Cameroun"
                value={formData.address}
                onChange={handleChange}
                disabled={createOrganization.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {createOrganization.error && (
          <Alert variant="destructive">
            <AlertDescription>{createOrganization.error.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href="/preferences/organizations">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={createOrganization.isPending || uploading}
            className="flex-1"
          >
            {createOrganization.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 mr-2" />
                Créer l&apos;organisation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
