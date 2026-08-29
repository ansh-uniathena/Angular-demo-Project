import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { QuizAttemptListItem } from './quiz-attempt.model';
import { StudentDashboardApiService } from './student-dashboard-api.service';

@Injectable()
export class QuizAttemptsStore {
  private readonly api = inject(StudentDashboardApiService);

  private readonly _data = signal<QuizAttemptListItem[]>([]);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._data().length === 0);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api
      .getQuizAttempts()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => this._data.set(data),
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }
}
