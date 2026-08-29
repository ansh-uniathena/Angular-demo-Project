import { Routes } from '@angular/router';
import { guestGuard, lockScreenGuard, passwordResetFlowGuard } from '../../core/auth/auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./login/login.page').then((m) => m.LoginPage) },
      {
        path: 'register',
        loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
      },
      {
        path: 'otp',
        canActivate: [passwordResetFlowGuard],
        loadComponent: () => import('./otp/otp.page').then((m) => m.OtpPage),
      },
      {
        path: 'set-password',
        canActivate: [passwordResetFlowGuard],
        loadComponent: () =>
          import('./set-password/set-password.page').then((m) => m.SetPasswordPage),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    // Deliberately NOT nested under the layout route above — Lock Screen has
    // its own centered layout, not the split-panel shell. See CLAUDE.md §1.
    path: 'lock',
    canActivate: [lockScreenGuard],
    loadComponent: () => import('./lock-screen/lock-screen.page').then((m) => m.LockScreenPage),
  },
];
