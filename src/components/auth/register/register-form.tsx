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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeClosed } from "@solar-icons/react";
import { useRegisterUser } from "@/hooks/use-auth";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Nouveau state pour suivi de l'envoi réussi
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending, error } = useRegisterUser();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          // Optionnel : vous pouvez rediriger plus tard, ou pas du tout
          // router.push("/register/verification");
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
              ? "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
              : "Rejoignez la communauté K.kits en quelques secondes !"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center text-primary font-semibold py-8">
              Un email a été envoyé à <strong>{formData.email}</strong>. Merci
              de vérifier votre boîte de réception pour confirmer votre compte.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Votre nom d'utilisateur"
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
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isPending}
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
                    className="absolute right-3 top-10 text-sm text-muted-foreground hover:text-foreground"
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
                  <p className="text-destructive text-center mt-2">
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
