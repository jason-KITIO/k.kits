import type {
  RegisterUserPayload,
  AuthResponse,
  VerifyEmailParams,
  SendOtpPayload,
  VerifyOtpPayload,
  LoginPayload,
} from "@/types/auth";

export async function registerUser(
  data: RegisterUserPayload
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/email/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de l'inscription");
  }
  return res.json();
}

export async function verifyEmail(
  params: VerifyEmailParams
): Promise<AuthResponse> {
  const url = new URL("/api/auth/email/verify", window.location.origin);
  url.searchParams.append("token", params.token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de la vérification email"
    );
  }
  return res.json();
}

export async function sendOtp(data: SendOtpPayload): Promise<AuthResponse> {
  const res = await fetch("/api/auth/email/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de l’envoi du code OTP");
  }
  return res.json();
}

export async function verifyOtp(data: VerifyOtpPayload): Promise<AuthResponse> {
  const res = await fetch("/api/auth/email/login/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de la vérification OTP");
  }
  return res.json();
}

export async function login(data: LoginPayload): Promise<AuthResponse> {
  const res = await fetch("/api/auth/email/login", {
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
