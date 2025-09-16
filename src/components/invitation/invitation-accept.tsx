"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useValidateInvitation } from "@/hooks/use-invitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export function InvitationAccept() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: invitation,
    isLoading,
    error,
  } = useValidateInvitation(token || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsSubmitting(true);

    // Création de username à partir du prénom et nom
    const username = `${formData.firstName}${formData.lastName}`.toLowerCase();

    try {
      // 1. Créer le compte utilisateur avec username
      const registerResponse = await fetch("/api/auth/email/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: invitation?.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username, // Envoi du username concaténé
          emailVerified: true, // Email automatiquement vérifié via invitation
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        if (registerResponse.status === 409) {
          throw new Error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter.");
        }
        throw new Error(error.error || "Erreur lors de l'inscription");
      }

      const { user } = await registerResponse.json();

      // 2. Accepter l'invitation
      const acceptResponse = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          userId: user.id,
        }),
      });

      if (!acceptResponse.ok) {
        throw new Error("Erreur lors de l'acceptation de l'invitation");
      }

      const { organizationId } = await acceptResponse.json();

      toast.success("Compte créé et invitation acceptée !");
      router.push(`/preferences/organizations/${organizationId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Validation de l'invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !invitation?.valid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Invitation invalide</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cette invitation a expiré ou n'est plus valide.
                </p>
              </div>
              <Button onClick={() => router.push("/login")}>
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-xl">Accepter l'invitation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Vous êtes invité à rejoindre{" "}
            <strong>{invitation.organizationName}</strong>
            en tant que <strong>{invitation.roleName}</strong>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={invitation.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                Confirmer le mot de passe *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
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
        </CardContent>
      </Card>
    </div>
  );
}
