import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { CourseDetail } from './course-detail.model';
import { CommentRequest, CourseListRequest, CourseListResponse } from './course-query.model';

@Injectable({ providedIn: 'root' })
export class CourseApiService {
  private readonly api = inject(ApiClient);

  getCourses(request: CourseListRequest): Observable<CourseListResponse> {
    return this.api.get<CourseListResponse>('/courses', {
      params: {
        page: request.page,
        pageSize: request.pageSize,
        ...(request.search ? { search: request.search } : {}),
        ...(request.sort ? { sort: request.sort } : {}),
        ...(request.categoryIds?.length ? { categoryIds: request.categoryIds.join(',') } : {}),
        ...(request.levelIds?.length ? { levelIds: request.levelIds.join(',') } : {}),
        ...(request.priceOptionId ? { priceOptionId: request.priceOptionId } : {}),
      },
    });
  }

  getCourseBySlug(slug: string): Observable<CourseDetail> {
    return this.api.get<CourseDetail>(`/courses/${slug}`);
  }

  postComment(slug: string, payload: CommentRequest): Observable<{ success: true }> {
    return this.api.post<{ success: true }>(`/courses/${slug}/comments`, payload);
  }
}
