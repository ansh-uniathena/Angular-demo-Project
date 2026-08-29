import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../shared/models/user.model';
import { AuthService } from './auth.service';

/** Blocks unauthenticated (or locked) access to protected routes. UX only — see CLAUDE.md §15. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated() && !auth.locked()) return true;
  if (auth.locked()) return router.createUrlTree(['/auth/lock']);
  return router.createUrlTree(['/auth/login']);
};

/** Keeps an already-authenticated user out of the auth screens. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() && !auth.locked() ? router.createUrlTree(['/']) : true;
};

/** OTP and Set Password only make sense mid-flow — bounce straight navigation back to the start. */
export const passwordResetFlowGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.pendingEmail() !== null ? true : router.createUrlTree(['/auth/forgot-password']);
};

/** The two dashboards are role-exclusive — a student hitting /instructor/* (or vice versa) is redirected, not shown a broken layout. */
export function roleGuard(role: UserRole): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();
    if (!user) return router.createUrlTree(['/auth/login']);
    return user.role === role ? true : router.createUrlTree(['/unauthorized']);
  };
}

/**
 * Lock Screen has no real trigger yet (no dashboard/idle-timeout exists to
 * fire it) — see CLAUDE.md §1. This only requires a known session to exist,
 * not that it's actually locked, so the route stays reachable for preview.
 */
export const lockScreenGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.currentUser() !== null ? true : router.createUrlTree(['/auth/login']);
};
