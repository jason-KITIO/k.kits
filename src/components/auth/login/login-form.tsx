"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import Link from "next/link";
import { usePhoneLogin } from "@/hooks/use-phone-auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/molecules";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: mutateEmail, isPending: loadingEmail, error: errorEmail } = useLogin();
  const { mutate: mutatePhone, isPending: loadingPhone, error: errorPhone } = usePhoneLogin();

  const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  const isValidPhone = (value: string) => /^\+[1-9]\d{1,14}$/.test(value);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (isValidEmail(input)) {
      mutateEmail({ email: input, password }, {
        onSuccess: (response) => {
          if (response.requiresOtp) {
            localStorage.setItem("otpEmail", input);
            router.push("/login/verification");
          } else {
            router.push("/dashboard");
          }
        },
      });
    } else if (isValidPhone(input)) {
      mutatePhone({ phone: input, password }, {
        onSuccess: () => {
          localStorage.setItem("otpPhone", input);
          router.push("/login/verification");
        },
      });
    } else {
      alert("Veuillez saisir une adresse email ou un numéro de téléphone valide.");
    }
  }

  const isLoading = loadingEmail || loadingPhone;
  const error = errorEmail || errorPhone;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard title="Connexion" description="Saisissez votre email ou numéro de téléphone et mot de passe.">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="input">Email ou téléphone</Label>
              <Input
                id="input"
                type="text"
                placeholder="Entrer votre email ou votre numero"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <FormField
              id="password"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={setPassword}
              disabled={isLoading}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            {error && <p className="text-destructive text-center mt-2">{error.message}</p>}
            <div className="text-center text-sm">
              Pas encore inscrit ?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Créez un compte
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
