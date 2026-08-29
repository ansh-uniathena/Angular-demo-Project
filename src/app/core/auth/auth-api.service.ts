import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api/api-client';
import {
  AuthSession,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  OtpResendRequest,
  OtpVerifyRequest,
  OtpVerifyResponse,
  RegisterRequest,
  SetPasswordRequest,
  UnlockRequest,
} from './auth.model';

/** Typed HTTP boundary for auth. Never called directly by components — see AuthService. */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly api = inject(ApiClient);

  login(payload: LoginRequest): Observable<AuthSession> {
    return this.api.post<AuthSession>('/auth/login', payload);
  }

  register(payload: RegisterRequest): Observable<AuthSession> {
    return this.api.post<AuthSession>('/auth/register', payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.api.post<ForgotPasswordResponse>('/auth/forgot-password', payload);
  }

  verifyOtp(payload: OtpVerifyRequest): Observable<OtpVerifyResponse> {
    return this.api.post<OtpVerifyResponse>('/auth/otp/verify', payload);
  }

  resendOtp(payload: OtpResendRequest): Observable<ForgotPasswordResponse> {
    return this.api.post<ForgotPasswordResponse>('/auth/otp/resend', payload);
  }

  setPassword(payload: SetPasswordRequest): Observable<{ success: true }> {
    return this.api.post<{ success: true }>('/auth/set-password', payload);
  }

  unlock(payload: UnlockRequest): Observable<AuthSession> {
    return this.api.post<AuthSession>('/auth/unlock', payload);
  }
}
