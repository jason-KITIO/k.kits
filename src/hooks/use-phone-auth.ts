import { useMutation } from "@tanstack/react-query";
import {
  sendPhoneVerification,
  verifyPhone,
  phoneLogin,
  phoneVerify,
} from "@/services/phone-auth-service";
import type {
  SendPhoneVerificationPayload,
  VerifyPhonePayload,
  PhoneAuthResponse,
  PhoneLoginPayload,
  PhoneVerifyPayload,
} from "@/types/phone-auth";

export function useSendPhoneVerification() {
  return useMutation<PhoneAuthResponse, Error, SendPhoneVerificationPayload>({
    mutationFn: (data) => sendPhoneVerification(data),
  });
}

export function useVerifyPhone() {
  return useMutation<PhoneAuthResponse, Error, VerifyPhonePayload>({
    mutationFn: (data) => verifyPhone(data),
  });
}
export function usePhoneLogin() {
  return useMutation<PhoneAuthResponse, Error, PhoneLoginPayload>({
    mutationFn: (data) => phoneLogin(data),
  });
}

export function usePhoneVerify() {
  return useMutation<PhoneAuthResponse, Error, PhoneVerifyPayload>({
    mutationFn: (data) => phoneVerify(data),
  });
}
