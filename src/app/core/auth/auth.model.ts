import { User } from '../../shared/models/user.model';

export interface AuthSession {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  maskedEmail: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface OtpVerifyResponse {
  resetToken: string;
}

export interface OtpResendRequest {
  email: string;
}

export interface SetPasswordRequest {
  email: string;
  resetToken: string;
  password: string;
}

export interface UnlockRequest {
  email: string;
  password: string;
}
