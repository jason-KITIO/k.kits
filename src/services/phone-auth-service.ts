import type {
  SendPhoneVerificationPayload,
  VerifyPhonePayload,
  PhoneAuthResponse,
  PhoneLoginPayload,
  PhoneVerifyPayload,
} from "@/types/phone-auth";

export async function sendPhoneVerification(
  data: SendPhoneVerificationPayload
): Promise<PhoneAuthResponse> {
  const res = await fetch("/api/auth/phone/send-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de l'envoi du SMS");
  }
  return res.json();
}

export async function verifyPhone(
  data: VerifyPhonePayload
): Promise<PhoneAuthResponse> {
  const res = await fetch("/api/auth/phone/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de la vérification du code"
    );
  }
  return res.json();
}

export async function phoneLogin(
  data: PhoneLoginPayload
): Promise<PhoneAuthResponse> {
  const res = await fetch("/api/auth/phone/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de la connexion");
  }
  return res.json();
}

export async function phoneVerify(
  data: PhoneVerifyPayload
): Promise<PhoneAuthResponse> {
  const res = await fetch("/api/auth/phone/login/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de la vérification");
  }
  return res.json();
}
