"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRegisterUser } from "@/hooks/use-auth";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/molecules";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending, error } = useRegisterUser();

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    mutate(formData, { onSuccess: () => setIsSuccess(true) });
  }

  const description = isSuccess
    ? "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
    : "Rejoignez la communauté K.kits en quelques secondes !";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard title="Commencez votre nouvelle aventure" description={description}>
        {isSuccess ? (
          <div className="text-center text-primary font-semibold py-8">
            Un email a été envoyé à <strong>{formData.email}</strong>. Merci de vérifier votre boîte de
            réception pour confirmer votre compte.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <FormField
                id="username"
                label="Username"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange("username")}
                disabled={isPending}
                required
              />
              <FormField
                id="email"
                label="Adresse email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={handleChange("email")}
                disabled={isPending}
                required
              />
              <FormField
                id="password"
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                disabled={isPending}
                required
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Création en cours..." : "Créez un compte"}
              </Button>
              {error && <p className="text-destructive text-center mt-2">{(error as Error).message}</p>}
            </div>
            <div className="text-center text-sm mt-4">
              Déjà inscrit ?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Se connecter
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
