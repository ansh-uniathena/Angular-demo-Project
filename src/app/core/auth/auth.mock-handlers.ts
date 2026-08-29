import { of, throwError } from 'rxjs';
import { AppError } from '../error-handling/app-error';
import { User } from '../../shared/models/user.model';
import { MockApiClient } from '../api/mock-api-client';
import { AuthSession, LoginRequest, RegisterRequest } from './auth.model';
import { DEMO_OTP, findUserByEmail, maskEmail, mockUsers, pendingResets } from './auth.mock-data';

function session(user: User): AuthSession {
  return { user, token: crypto.randomUUID() };
}

/** Registers every `/auth/*` mock route. Called once from app.config.ts. */
export function registerAuthMockHandlers(api: MockApiClient): void {
  api.register('POST', '/auth/login', (body) => {
    const { email, password } = body as LoginRequest;
    const record = findUserByEmail(email);
    if (!record) return throwError(() => new AppError('No account found for this email.', 404));
    if (record.password !== password) {
      return throwError(() => new AppError('Incorrect password.', 401));
    }
    return of(session(record.user));
  });

  api.register('POST', '/auth/register', (body) => {
    const { fullName, email, password } = body as RegisterRequest;
    if (findUserByEmail(email)) {
      return throwError(() => new AppError('An account with this email already exists.', 409));
    }
    const user: User = {
      id: crypto.randomUUID(),
      name: fullName,
      email,
      role: 'student',
      avatarUrl: null,
    };
    mockUsers.push({ user, password });
    return of(session(user));
  });

  api.register('POST', '/auth/forgot-password', (body) => {
    const { email } = body as { email: string };
    const record = findUserByEmail(email);
    if (!record) return throwError(() => new AppError('No account found for this email.', 404));
    pendingResets.set(email, { otpVerified: false, resetToken: '' });
    return of({ maskedEmail: maskEmail(email) });
  });

  api.register('POST', '/auth/otp/resend', (body) => {
    const { email } = body as { email: string };
    const record = findUserByEmail(email);
    if (!record) return throwError(() => new AppError('No account found for this email.', 404));
    return of({ maskedEmail: maskEmail(email) });
  });

  api.register('POST', '/auth/otp/verify', (body) => {
    const { email, otp } = body as { email: string; otp: string };
    if (otp !== DEMO_OTP) {
      return throwError(() => new AppError('Invalid or expired OTP.', 400));
    }
    const resetToken = crypto.randomUUID();
    pendingResets.set(email, { otpVerified: true, resetToken });
    return of({ resetToken });
  });

  api.register('POST', '/auth/set-password', (body) => {
    const { email, resetToken, password } = body as {
      email: string;
      resetToken: string;
      password: string;
    };
    const pending = pendingResets.get(email);
    if (!pending?.otpVerified || pending.resetToken !== resetToken) {
      return throwError(() => new AppError('Reset session expired — please start again.', 401));
    }
    const record = findUserByEmail(email);
    if (!record) return throwError(() => new AppError('No account found for this email.', 404));
    record.password = password;
    pendingResets.delete(email);
    return of({ success: true as const });
  });

  api.register('POST', '/auth/unlock', (body) => {
    const { email, password } = body as { email: string; password: string };
    const record = findUserByEmail(email);
    if (!record) return throwError(() => new AppError('No account found for this email.', 404));
    if (record.password !== password) {
      return throwError(() => new AppError('Incorrect password.', 401));
    }
    return of(session(record.user));
  });
}
