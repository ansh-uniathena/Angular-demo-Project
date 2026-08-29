import { Routes } from '@angular/router';

export const studentDashboardRoutes: Routes = [
  {
    path: '',
    data: { title: 'Dashboard' },
    loadComponent: () =>
      import('./dashboard-home/dashboard-home.page').then((m) => m.DashboardHomePage),
  },
  {
    path: 'profile',
    data: { title: 'My Profile' },
    loadComponent: () =>
      import('./profile/student-profile.page').then((m) => m.StudentProfilePage),
  },
  {
    path: 'enrolled-courses',
    data: { title: 'Enrolled Courses' },
    loadComponent: () =>
      import('./enrolled-courses/enrolled-courses.page').then((m) => m.EnrolledCoursesPage),
  },
  {
    path: 'certificates',
    data: { title: 'My Certificates' },
    loadComponent: () => import('./certificates/certificates.page').then((m) => m.CertificatesPage),
  },
  {
    path: 'quiz-attempts',
    data: { title: 'My Quiz Attempts' },
    loadComponent: () =>
      import('./quiz-attempts/quiz-attempts.page').then((m) => m.QuizAttemptsPage),
  },
];
