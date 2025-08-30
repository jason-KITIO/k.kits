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
import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useVerifyPhone } from "@/hooks/use-phone-auth";

export function PhoneVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const { mutate, isPending, error } = useVerifyPhone();

  useEffect(() => {
    const storedPhone = localStorage.getItem("phoneNumber");
    if (storedPhone) {
      setPhoneNumber(storedPhone);
    } else {
      // Pas de numéro, redirige vers saisie téléphone
      router.push("/onboarding/telephone");
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!phoneNumber) return;

    mutate(
      { phoneNumber, code: otp },
      {
        onSuccess: () => {
          localStorage.removeItem("phoneNumber");
          router.push("/dashboard");
        },
      }
    );
  }

  function handleOtpChange(value: string) {
    setOtp(value);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bon retour sur K.kits</CardTitle>
          <CardDescription>
            Entrez le code de vérification envoyé par sms au :{" "}
            <span className="text-green-500">{phoneNumber ?? ""}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="w-full justify-center flex">
                <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Vérification en cours..." : "Vérifier"}
              </Button>
              {error && (
                <p className="text-red-600 text-center mt-2">
                  {(error as Error).message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
