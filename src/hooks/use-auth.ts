import { useMutation } from "@tanstack/react-query";
import { registerUser, verifyEmail, sendOtp, verifyOtp, login } from "@/services/auth-service";
import type { RegisterUserPayload, AuthResponse, VerifyEmailParams, SendOtpPayload, VerifyOtpPayload, LoginPayload } from "@/types/auth";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (data: RegisterUserPayload) => await registerUser(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (params: VerifyEmailParams) => await verifyEmail(params),
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (data: SendOtpPayload) => await sendOtp(data),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpPayload) => await verifyOtp(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => await login(data),
  });
};
