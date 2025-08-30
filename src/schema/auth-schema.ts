import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email("Email invalide"),
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(6, "Mot de passe d'au moins 6 caractères"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe d'au moins 6 caractères"),
});

export const verifyEmailSchema = z.object({
  token: z.string().nonempty("Token manquant"),
});

export const sendOtpSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Email invalide"),
  otp: z.string().length(6, "Le code OTP doit contenir 6 chiffres"),
});
