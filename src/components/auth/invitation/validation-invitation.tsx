"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Eye, EyeClosed } from "@solar-icons/react";
import Link from "next/link";

import {
  useAcceptInvitation,
  useInvitationEmail,
} from "@/hooks/use-invitation";
export function ValidationInvitationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending, error } = useAcceptInvitation();

  // Récupérer le token depuis l’URL côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Full URL:", window.location.href);
      console.log("Search params:", window.location.search);
      const searchParams = new URLSearchParams(window.location.search);
      console.log("All params:", Object.fromEntries(searchParams.entries()));
      const t = searchParams.get("token");
      const c = searchParams.get("organizationId");
      console.log("Extracted - token:", t, "organizationId:", c);
      if (t) setToken(t);
      if (c) setOrganizationId(c);
    }
  }, []);
  // Mettre à jour email avec data si présent, seulement une fois (évite boucle)
  const {
    data,
    isPending: isInvitationPending,
    error: invitationError,
    mutate: fetchInvitationEmail,
  } = useInvitationEmail(token || "", organizationId || "");

  // Déclencher la récupération de l&apos;email quand on a le token et organizationId
  useEffect(() => {
    if (token && organizationId) {
      console.log(
        "Fetching invitation email for token:",
        token,
        "organizationId:",
        organizationId
      );
      fetchInvitationEmail(undefined, {
        onSuccess: (result) => {
          console.log("Email fetched successfully:", result);
          if (result?.email) {
            setFormData((prev) => ({ ...prev, email: result.email }));
          }
        },
        onError: (error) => {
          console.error("Error fetching email:", error);
        },
      });
    }
  }, [token, organizationId, fetchInvitationEmail]);

  useEffect(() => {
    console.log("Debug - token:", token, "organizationId:", organizationId);
    console.log(
      "Debug - data:",
      data,
      "isPending:",
      isInvitationPending,
      "error:",
      invitationError
    );

    if (data?.email && !formData.email) {
      console.log("Setting email from data:", data.email);
      setFormData((prev) => ({ ...prev, email: data.email }));
    }
  }, [data, token, organizationId]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;
    if (id === "email") return; // email readonly
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      alert("Token d&apos;invitation manquant dans l'URL.");
      return;
    }
    if (!formData.email) {
      alert("Email invalide ou manquant.");
      return;
    }

    mutate(
      {
        username: formData.username,
        password: formData.password,
        token,
        organizationId: organizationId || "",
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          // Optionnel: redirection après succès
          // router.push("/login");
        },
      }
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Commencez votre nouvelle aventure
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "Bienvenue Chez K.kits !"
              : "Votre gérant vous a invité à rejoindre K.kits !"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center text-green-600 font-semibold py-8">
              Vous allez être redirigé... pour vous connecter
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Votre nom d&apos;utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    disabled
                    placeholder="Email invité"
                  />
                </div>
                <div className="grid gap-3 relative">
                  <Label htmlFor="password" className="flex-1">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-sm text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    disabled={isPending}
                  >
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Création en cours..." : "Créez un compte"}
                </Button>
                {error && (
                  <p className="text-red-600 text-center mt-2">
                    {(error as Error).message}
                  </p>
                )}
              </div>
              <div className="text-center text-sm mt-4">
                Déjà inscrit ?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Se connecter
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
