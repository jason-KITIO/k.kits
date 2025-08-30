import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  verifyEmail,
  sendOtp,
  verifyOtp,
  login,
} from "@/services/auth-service";
import type {
  RegisterUserPayload,
  AuthResponse,
  VerifyEmailParams,
  SendOtpPayload,
  VerifyOtpPayload,
  LoginPayload,
} from "@/types/auth";

export function useRegisterUser() {
  return useMutation<AuthResponse, Error, RegisterUserPayload>({
    mutationFn: (data) => registerUser(data),
  });
}

export function useVerifyEmail() {
  return useMutation<AuthResponse, Error, VerifyEmailParams>({
    mutationFn: (params) => verifyEmail(params),
  });
}
export function useSendOtp() {
  return useMutation<AuthResponse, Error, SendOtpPayload>({
    mutationFn: (data) => sendOtp(data),
  });
}

export function useVerifyOtp() {
  return useMutation<AuthResponse, Error, VerifyOtpPayload>({
    mutationFn: (data) => verifyOtp(data),
  });
}

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (data) => login(data),
  });
}
