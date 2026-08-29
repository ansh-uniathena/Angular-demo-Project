import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.routes').then((m) => m.courseRoutes),
      },
      {
        path: 'student',
        canActivate: [authGuard, roleGuard('student')],
        loadComponent: () =>
          import('./layout/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./features/student-dashboard/student-dashboard.routes').then(
                (m) => m.studentDashboardRoutes,
              ),
          },
        ],
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./features/unauthorized/unauthorized.page').then((m) => m.UnauthorizedPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
