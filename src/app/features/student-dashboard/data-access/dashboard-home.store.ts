import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { DashboardSummary } from './dashboard-summary.model';
import { StudentDashboardApiService } from './student-dashboard-api.service';

@Injectable()
export class DashboardHomeStore {
  private readonly api = inject(StudentDashboardApiService);

  private readonly _data = signal<DashboardSummary | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._data() === null);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api
      .getDashboardSummary()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => this._data.set(data),
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }
}
