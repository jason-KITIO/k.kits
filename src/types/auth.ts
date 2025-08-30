import { Organization, User } from "@prisma/client";

export interface RegisterUserPayload {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
}

export interface VerifyEmailParams {
  token: string;
}
export interface SendOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface AuthResponse {
  message: string;
  user?: User; // à typer selon vos données User
  organizations?: Organization[]; // liste d’organisations
  selectedOrganization?: Organization | null;
}
