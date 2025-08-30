import { z } from "zod";

export const sendPhoneVerificationSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Numéro de téléphone invalide"),
});

export const verifyPhoneSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Numéro de téléphone invalide"),
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
});
export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Mot de passe d'au moins 6 caractères"),
});

export const phoneVerifySchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Numéro de téléphone invalide"),
  otp: z.string().length(6, "Le code OTP doit contenir 6 chiffres"),
});
