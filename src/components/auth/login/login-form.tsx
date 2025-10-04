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
import { useLogin } from "@/hooks/use-auth"; // importez vos hooks correspondants
import Link from "next/link";
import { usePhoneLogin } from "@/hooks/use-phone-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState(""); // email ou téléphone
  const [password, setPassword] = useState("");

  const {
    mutate: mutateEmail,
    isPending: loadingEmail,
    error: errorEmail,
  } = useLogin();
  const {
    mutate: mutatePhone,
    isPending: loadingPhone,
    error: errorPhone,
  } = usePhoneLogin();

  function isValidEmail(value: string): boolean {
    // Simple regex email validation
    return /^\S+@\S+\.\S+$/.test(value);
  }

  function isValidPhone(value: string): boolean {
    // Simple international phone check (starts with + and digits)
    return /^\+[1-9]\d{1,14}$/.test(value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (isValidEmail(input)) {
      mutateEmail(
        { email: input, password },
        {
          onSuccess: (response) => {
            if (response.requiresOtp) {
              localStorage.setItem("otpEmail", input);
              router.push("/login/verification");
            } else {
              router.push("/dashboard");
            }
          },
        }
      );
    } else if (isValidPhone(input)) {
      mutatePhone(
        { phone: input, password },
        {
          onSuccess: () => {
            localStorage.setItem("otpPhone", input);
            router.push("/login/verification");
          },
        }
      );
    } else {
      alert(
        "Veuillez saisir une adresse email ou un numéro de téléphone valide."
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Connexion</CardTitle>
          <CardDescription>
            Saisissez votre email ou numéro de téléphone et mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  disabled={loadingEmail || loadingPhone}
                />
              </div>
              <div className="grid gap-3 relative">
                <Label htmlFor="password" className="flex-1">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loadingEmail || loadingPhone}
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
                  disabled={loadingEmail || loadingPhone}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loadingEmail || loadingPhone}
              >
                {loadingEmail || loadingPhone
                  ? "Connexion en cours..."
                  : "Se connecter"}
              </Button>
              {(errorEmail || errorPhone) && (
                <p className="text-destructive text-center mt-2">
                  {(errorEmail ?? errorPhone)?.message}
                </p>
              )}
              <div className="text-center text-sm">
                Pas encore inscrit ?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Créez un compte
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
