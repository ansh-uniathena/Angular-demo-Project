import { of } from 'rxjs';
import { MockApiClient } from '../../../core/api/mock-api-client';
import { Course } from '../../../shared/models/course.model';
import { EnrolledCoursesFilter } from './enrolled-course.model';
import { EnrolledCoursesResponse } from './enrolled-courses-query.model';
import { StudentProfileUpdateRequest } from './student-profile.model';
import {
  mockCatalogCourseById,
  mockCertificates,
  mockDashboardSummary,
  mockEnrolledCourses,
  mockQuizAttempts,
  mockStudentProfile,
} from './student-dashboard.mock-data';

const PAGE_SIZE = 9;

function coursesFor(filter: EnrolledCoursesFilter): Course[] {
  const matches =
    filter === 'enrolled'
      ? mockEnrolledCourses
      : mockEnrolledCourses.filter((c) => c.enrollmentStatus === filter);
  return matches.map((c) => mockCatalogCourseById.get(c.id) as Course);
}

/** Registers `/student/*` mock routes. Called once from app.config.ts. */
export function registerStudentDashboardMockHandlers(api: MockApiClient): void {
  api.register('GET', '/student/dashboard-summary', () => of(mockDashboardSummary));

  api.register('GET', '/student/profile', () => of(mockStudentProfile));

  api.register('PUT', '/student/profile', (body) => {
    const patch = body as StudentProfileUpdateRequest;
    Object.assign(mockStudentProfile, patch);
    return of(mockStudentProfile);
  });

  api.register('GET', '/student/enrolled-courses', (_body, params) => {
    const filter = (params['filter'] as EnrolledCoursesFilter) || 'enrolled';
    const page = Number(params['page'] ?? 1);
    const pageSize = Number(params['pageSize'] ?? PAGE_SIZE);

    const items = coursesFor(filter);
    const start = (page - 1) * pageSize;

    const response: EnrolledCoursesResponse = {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      pageSize,
      counts: {
        enrolled: mockEnrolledCourses.length,
        active: mockEnrolledCourses.filter((c) => c.enrollmentStatus === 'active').length,
        completed: mockEnrolledCourses.filter((c) => c.enrollmentStatus === 'completed').length,
      },
    };
    return of(response);
  });

  api.register('GET', '/student/certificates', () => of(mockCertificates));

  api.register('GET', '/student/quiz-attempts', () => of(mockQuizAttempts));
}
