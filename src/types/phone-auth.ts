import { User } from "@prisma/client";

export interface SendPhoneVerificationPayload {
  phoneNumber: string;
}

export interface VerifyPhonePayload {
  phoneNumber: string;
  code: string;
}

export interface PhoneAuthResponse {
  message: string;
  code?: string; // dans mode dev (optionnel)
  userId?: string; // optionnel
  phone?: string;
  user?: User; // à typer selon votre modèle User
}

export interface PhoneLoginPayload {
  phone: string;
  password: string;
}

export interface PhoneVerifyPayload {
  phone: string;
  otp: string;
}
