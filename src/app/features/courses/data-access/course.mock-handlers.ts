import { of, throwError } from 'rxjs';
import { AppError } from '../../../core/error-handling/app-error';
import { MockApiClient } from '../../../core/api/mock-api-client';
import { Course } from '../../../shared/models/course.model';
import { buildCourseFilters, mockCourses } from './course.mock-data';
import { findCourseDetailBySlug } from './course-detail.mock-data';
import { CourseListResponse, CourseSort } from './course-query.model';

function applySort(courses: Course[], sort: CourseSort | undefined): Course[] {
  const sorted = [...courses];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price-desc':
      return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
    default:
      return sorted;
  }
}

/** Registers `/courses*` mock routes. Called once from app.config.ts. */
export function registerCourseMockHandlers(api: MockApiClient): void {
  api.register('GET', '/courses', (_body, params) => {
    const page = Number(params['page'] ?? 1);
    const pageSize = Number(params['pageSize'] ?? 9);
    const search = params['search']?.toLowerCase().trim();
    const categoryIds = params['categoryIds']?.split(',').filter(Boolean);
    const levelIds = params['levelIds']?.split(',').filter(Boolean);
    const priceOptionId = params['priceOptionId'];

    let filtered = mockCourses;
    if (search) filtered = filtered.filter((c) => c.title.toLowerCase().includes(search));
    if (categoryIds?.length) filtered = filtered.filter((c) => categoryIds.includes(c.category));
    if (levelIds?.length) filtered = filtered.filter((c) => levelIds.includes(c.level));
    if (priceOptionId === 'free') filtered = filtered.filter((c) => c.price === null);
    if (priceOptionId === 'paid') filtered = filtered.filter((c) => c.price !== null);

    const sorted = applySort(filtered, params['sort'] as CourseSort | undefined);
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    const response: CourseListResponse = {
      items,
      total: sorted.length,
      page,
      pageSize,
      filters: buildCourseFilters(mockCourses),
    };
    return of(response);
  });

  api.register('GET', '/courses/:slug', (_body, params) => {
    const detail = findCourseDetailBySlug(params['slug']);
    if (!detail) return throwError(() => new AppError('Course not found.', 404));
    return of(detail);
  });

  api.register('POST', '/courses/:slug/comments', (body, params) => {
    const detail = findCourseDetailBySlug(params['slug']);
    if (!detail) return throwError(() => new AppError('Course not found.', 404));
    const { name, email, comment } = body as { name: string; email: string; comment: string };
    if (!name || !email || !comment) {
      return throwError(() => new AppError('Name, email, and comment are required.', 400));
    }
    return of({ success: true as const });
  });
}
