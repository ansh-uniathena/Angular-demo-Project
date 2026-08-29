import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { Course } from '../../../shared/models/course.model';
import { EnrolledCoursesFilter } from './enrolled-course.model';
import { StudentDashboardApiService } from './student-dashboard-api.service';

const PAGE_SIZE = 9;

@Injectable()
export class EnrolledCoursesStore {
  private readonly api = inject(StudentDashboardApiService);

  private readonly _courses = signal<Course[]>([]);
  private readonly _total = signal(0);
  private readonly _counts = signal<Record<EnrolledCoursesFilter, number>>({
    enrolled: 0,
    active: 0,
    completed: 0,
  });
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  private readonly _filter = signal<EnrolledCoursesFilter>('enrolled');
  private readonly _page = signal(1);

  readonly courses = this._courses.asReadonly();
  readonly counts = this._counts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._courses().length === 0);

  readonly filter = this._filter.asReadonly();
  readonly page = this._page.asReadonly();
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this._total() / PAGE_SIZE)));

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api
      .getEnrolledCourses({ filter: this._filter(), page: this._page(), pageSize: PAGE_SIZE })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (response) => {
          this._courses.set(response.items);
          this._total.set(response.total);
          this._counts.set(response.counts);
        },
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }

  setFilter(filter: EnrolledCoursesFilter): void {
    if (filter === this._filter()) return;
    this._filter.set(filter);
    this._page.set(1);
    this.load();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this._page.set(page);
    this.load();
  }
}
