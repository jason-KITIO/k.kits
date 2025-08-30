"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function VerificationResultPage({
  success,
  redirectTo = "/login",
  className,
  ...props
}: {
  success: boolean;
  redirectTo?: string;
} & React.ComponentProps<"div">) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, redirectTo]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {success ? "Vérification réussie" : "Vérification échouée"}
          </CardTitle>
          <CardDescription>
            {success ? (
              <span className="text-green-600">
                Votre compte a bien été vérifié. Vous allez être redirigé...
              </span>
            ) : (
              <span className="text-red-600">
                La vérification a échoué. Veuillez patienter, vous serez
                redirigé sous peu.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            Redirection en cours, veuillez patienter...{" "}
            <a href={redirectTo} className="underline hover:text-blue-600">
              ou cliquez ici
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
