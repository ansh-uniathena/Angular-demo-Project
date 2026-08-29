import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { Certificate } from './certificate.model';
import { DashboardSummary } from './dashboard-summary.model';
import { EnrolledCoursesRequest, EnrolledCoursesResponse } from './enrolled-courses-query.model';
import { QuizAttemptListItem } from './quiz-attempt.model';
import { StudentProfile, StudentProfileUpdateRequest } from './student-profile.model';

@Injectable({ providedIn: 'root' })
export class StudentDashboardApiService {
  private readonly api = inject(ApiClient);

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>('/student/dashboard-summary');
  }

  getProfile(): Observable<StudentProfile> {
    return this.api.get<StudentProfile>('/student/profile');
  }

  updateProfile(payload: StudentProfileUpdateRequest): Observable<StudentProfile> {
    return this.api.put<StudentProfile>('/student/profile', payload);
  }

  getEnrolledCourses(request: EnrolledCoursesRequest): Observable<EnrolledCoursesResponse> {
    return this.api.get<EnrolledCoursesResponse>('/student/enrolled-courses', {
      params: { filter: request.filter, page: request.page, pageSize: request.pageSize },
    });
  }

  getCertificates(): Observable<Certificate[]> {
    return this.api.get<Certificate[]>('/student/certificates');
  }

  getQuizAttempts(): Observable<QuizAttemptListItem[]> {
    return this.api.get<QuizAttemptListItem[]>('/student/quiz-attempts');
  }
}
