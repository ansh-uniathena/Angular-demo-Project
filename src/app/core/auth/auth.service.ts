import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { AuthApiService } from './auth-api.service';
import { AuthSession, LoginRequest, RegisterRequest } from './auth.model';

// Demo-only persistence. Once a real backend exists, swap this for an
// httpOnly session cookie set by the server — see CLAUDE.md §15.
const SESSION_STORAGE_KEY = 'dreams-lms.session';

function loadStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

/**
 * Root-provided session facade — the only thing pages/guards/interceptors
 * touch for auth. Owns session state (cross-feature, per CLAUDE.md §6) and
 * the multi-step forgot-password flow state.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);

  private readonly stored = loadStoredSession();
  private readonly _currentUser = signal<User | null>(this.stored?.user ?? null);
  private readonly _locked = signal(false);
  private readonly _pendingEmail = signal<string | null>(null);
  private readonly _maskedEmail = signal<string | null>(null);
  private resetToken: string | null = null;
  private token: string | null = this.stored?.token ?? null;

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly locked = this._locked.asReadonly();
  readonly pendingEmail = this._pendingEmail.asReadonly();
  readonly maskedEmail = this._maskedEmail.asReadonly();

  login(payload: LoginRequest): Observable<User> {
    return this.authApi.login(payload).pipe(
      tap((session) => {
        this.setSession(session, payload.rememberMe);
        this._locked.set(false);
      }),
      map((session) => session.user),
    );
  }

  register(payload: RegisterRequest): Observable<User> {
    return this.authApi.register(payload).pipe(
      tap((session) => this.setSession(session, true)),
      map((session) => session.user),
    );
  }

  logout(): void {
    this._currentUser.set(null);
    this._locked.set(false);
    this.token = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  /** Locks the current session in place — dashboards can call this on idle timeout. */
  lock(): void {
    if (this._currentUser()) this._locked.set(true);
  }

  unlock(password: string): Observable<User> {
    const email = this._currentUser()?.email;
    if (!email) throw new Error('No locked session to unlock.');
    return this.authApi.unlock({ email, password }).pipe(
      tap((session) => {
        this.setSession(session, true);
        this._locked.set(false);
      }),
      map((session) => session.user),
    );
  }

  forgotPassword(email: string): Observable<{ maskedEmail: string }> {
    return this.authApi.forgotPassword({ email }).pipe(
      tap((response) => {
        this._pendingEmail.set(email);
        this._maskedEmail.set(response.maskedEmail);
      }),
    );
  }

  resendOtp(): Observable<{ maskedEmail: string }> {
    return this.authApi
      .resendOtp({ email: this.requirePendingEmail() })
      .pipe(tap((response) => this._maskedEmail.set(response.maskedEmail)));
  }

  verifyOtp(otp: string): Observable<void> {
    return this.authApi.verifyOtp({ email: this.requirePendingEmail(), otp }).pipe(
      tap((response) => (this.resetToken = response.resetToken)),
      map(() => undefined),
    );
  }

  setPassword(password: string): Observable<void> {
    const email = this.requirePendingEmail();
    if (!this.resetToken) throw new Error('OTP has not been verified for this reset.');
    return this.authApi.setPassword({ email, resetToken: this.resetToken, password }).pipe(
      tap(() => {
        this._pendingEmail.set(null);
        this._maskedEmail.set(null);
        this.resetToken = null;
      }),
      map(() => undefined),
    );
  }

  /** Read by the auth HTTP interceptor once a real backend is wired in. */
  getToken(): string | null {
    return this.token;
  }

  private requirePendingEmail(): string {
    const email = this._pendingEmail();
    if (!email) throw new Error('No password-reset flow in progress.');
    return email;
  }

  private setSession(session: AuthSession, persist: boolean): void {
    this._currentUser.set(session.user);
    this.token = session.token;
    if (persist) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }
}
