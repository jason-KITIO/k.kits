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
import { useVerifyOtp } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { usePhoneVerify } from "@/hooks/use-phone-auth";

export function VerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [contact, setContact] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isEmail, setIsEmail] = useState(false);

  const {
    mutate: mutateEmail,
    isPending: loadingEmail,
    error: errorEmail,
  } = useVerifyOtp();
  const {
    mutate: mutatePhone,
    isPending: loadingPhone,
    error: errorPhone,
  } = usePhoneVerify();

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    const storedPhone = localStorage.getItem("otpPhone");
    if (storedEmail) {
      setContact(storedEmail);
      setIsEmail(true);
    } else if (storedPhone) {
      setContact(storedPhone);
      setIsEmail(false);
    } else {
      // Ni email ni téléphone en localStorage => retour login
      router.push("/login");
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!contact) return;

    if (isEmail) {
      mutateEmail(
        { email: contact, otp },
        {
          onSuccess: () => {
            localStorage.removeItem("otpEmail");
            router.push("/preferences/organizations");
          },
        }
      );
    } else {
      mutatePhone(
        { phone: contact, otp },
        {
          onSuccess: () => {
            localStorage.removeItem("otpPhone");
            router.push("/dashboard");
          },
        }
      );
    }
  }

  function handleOtpChange(value: string) {
    // console.log(value);

    setOtp(value);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Vérification de sécurité</CardTitle>
          <CardDescription>
            Pour votre sécurité, un code de vérification est requis car vous ne vous êtes pas connecté depuis plus d'un mois.
            <br /><br />
            Entrez le code envoyé à :{" "}
            <span className="text-green-500">{contact ?? ""}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 justify-center">
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
              <Button
                type="submit"
                className="w-full"
                disabled={loadingEmail || loadingPhone}
              >
                {loadingEmail || loadingPhone
                  ? "Vérification en cours..."
                  : "Vérifier"}
              </Button>
              {(errorEmail || errorPhone) && (
                <p className="text-red-600 text-center mt-2">
                  {(errorEmail ?? errorPhone)?.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
