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
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSendPhoneVerification } from "@/hooks/use-phone-auth";

export function TelephoneForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const { mutate, isPending, error } = useSendPhoneVerification();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!phone) return;

    mutate(
      { phoneNumber: phone },
      {
        onSuccess: () => {
          localStorage.setItem("phoneNumber", phone);
          router.push("/onboarding/telephone/verification");
        },
      }
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 p-4 mx-auto max-w-md sm:max-w-lg md:max-w-xl", className)} {...props}>
      <Card>
        <CardHeader className="text-center px-4 sm:px-6 md:px-8">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">
            Vérifiez votre numéro de téléphone.
          </CardTitle>
          <CardDescription className="px-2 sm:px-4 md:px-6">
            Saisissez votre numéro de téléphone pour recevoir un code de
            vérification.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="phone" className="text-sm sm:text-base md:text-lg">Numéro de téléphone</Label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="CM"
                value={phone}
                onChange={setPhone}
                id="phone"
                className="w-full rounded border border-input px-3 py-2 text-base sm:text-lg"
                placeholder="Entrez votre numéro"
                required
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full py-3 text-base sm:text-lg" disabled={isPending}>
              {isPending ? "Envoi en cours..." : "Envoyer le code de vérification"}
            </Button>
            {error && (
              <p className="text-red-600 text-center mt-2 px-2">
                {(error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
