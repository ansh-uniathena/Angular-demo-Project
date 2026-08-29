import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { CourseApiService } from './course-api.service';
import { CourseDetail } from './course-detail.model';
import { CommentRequest } from './course-query.model';

/** Route-scoped facade for a single /courses/:slug page. */
@Injectable()
export class CourseDetailStore {
  private readonly api = inject(CourseApiService);

  private readonly _data = signal<CourseDetail | null>(null);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  private readonly _commentSubmitting = signal(false);
  private readonly _commentError = signal<string | null>(null);
  private readonly _commentSubmitted = signal(false);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._data() === null);

  readonly commentSubmitting = this._commentSubmitting.asReadonly();
  readonly commentError = this._commentError.asReadonly();
  readonly commentSubmitted = this._commentSubmitted.asReadonly();

  load(slug: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.api
      .getCourseBySlug(slug)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (detail) => this._data.set(detail),
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }

  submitComment(payload: CommentRequest): void {
    const slug = this._data()?.slug;
    if (!slug || this._commentSubmitting()) return;
    this._commentSubmitting.set(true);
    this._commentError.set(null);
    this.api
      .postComment(slug, payload)
      .pipe(finalize(() => this._commentSubmitting.set(false)))
      .subscribe({
        next: () => this._commentSubmitted.set(true),
        error: (error: unknown) => this._commentError.set(toUserMessage(error)),
      });
  }

  resetCommentState(): void {
    this._commentSubmitted.set(false);
    this._commentError.set(null);
  }
}
