import { Routes } from '@angular/router';

export const courseRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./catalog/courses-catalog.page').then((m) => m.CoursesCatalogPage),
  },
  {
    path: ':slug',
    loadComponent: () => import('./detail/course-detail.page').then((m) => m.CourseDetailPage),
  },
];
