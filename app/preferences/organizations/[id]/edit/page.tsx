"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useOrganization, useUpdateOrganization } from "@/hooks/use-organizations";
import { Skeleton } from "@/components/ui/skeleton";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function OrganizationEditPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  
  const { data: organization, isLoading } = useOrganization(orgId);
  const updateOrganization = useUpdateOrganization();
  
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

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        description: organization.description || "",
        domain: organization.domain?.replace('.kkits.com', '') || "",
        logo: organization.logo || "",
        address: organization.address || "",
        phone: organization.phone || "",
        email: organization.email || "",
        active: organization.active ?? true,
      });
    }
  }, [organization]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

    updateOrganization.mutate({ id: orgId, data: payload }, {
      onSuccess: () => {
        router.push("/preferences/organizations");
      }
    });
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>Organisation non trouvée</AlertDescription>
        </Alert>
      </div>
    );
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
              Modifier l'organisation
            </h1>
            <p className="text-muted-foreground mt-1">
              Modifiez les informations de votre organisation
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
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'organisation *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Mon Entreprise"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={updateOrganization.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre organisation..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={updateOrganization.isPending}
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
                    disabled={updateOrganization.isPending}
                    className="rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .kkits.com
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Input
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={updateOrganization.isPending || uploading}
                    className="flex-1"
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {formData.logo && (
                  <div className="mt-4">
                    <img
                      src={formData.logo}
                      alt="Logo"
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
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@monentreprise.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={updateOrganization.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+237 698 765 432"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={updateOrganization.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                type="text"
                placeholder="Logbessou, Douala, Cameroun"
                value={formData.address}
                onChange={handleChange}
                disabled={updateOrganization.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {updateOrganization.error && (
          <Alert variant="destructive">
            <AlertDescription>{updateOrganization.error.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href="/preferences/organizations">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={updateOrganization.isPending || uploading}
            className="flex-1"
          >
            {updateOrganization.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Modification en cours...
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 mr-2" />
                Modifier l'organisation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}