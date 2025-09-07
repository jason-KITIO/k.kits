import { useMutation } from "@tanstack/react-query";
import { sendPhoneVerification, verifyPhone, phoneLogin, phoneVerify } from "@/services/phone-auth-service";
import type { SendPhoneVerificationPayload, VerifyPhonePayload, PhoneLoginPayload, PhoneVerifyPayload } from "@/types/phone-auth";

export const useSendPhoneVerification = () => {
  return useMutation({
    mutationFn: async (data: SendPhoneVerificationPayload) => await sendPhoneVerification(data),
  });
};

export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: async (data: VerifyPhonePayload) => await verifyPhone(data),
  });
};

export const usePhoneLogin = () => {
  return useMutation({
    mutationFn: async (data: PhoneLoginPayload) => await phoneLogin(data),
  });
};

export const usePhoneVerify = () => {
  return useMutation({
    mutationFn: async (data: PhoneVerifyPayload) => await phoneVerify(data),
  });
};
