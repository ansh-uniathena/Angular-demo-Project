import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { StudentDashboardApiService } from './student-dashboard-api.service';
import { StudentProfile, StudentProfileUpdateRequest } from './student-profile.model';

@Injectable()
export class StudentProfileStore {
  private readonly api = inject(StudentDashboardApiService);

  private readonly _data = signal<StudentProfile | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly _editing = signal(false);
  private readonly _saving = signal(false);
  private readonly _saveError = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._data() === null);

  readonly editing = this._editing.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly saveError = this._saveError.asReadonly();

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api
      .getProfile()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => this._data.set(data),
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }

  startEdit(): void {
    this._saveError.set(null);
    this._editing.set(true);
  }

  cancelEdit(): void {
    this._editing.set(false);
    this._saveError.set(null);
  }

  save(patch: StudentProfileUpdateRequest): void {
    this._saving.set(true);
    this._saveError.set(null);
    this.api
      .updateProfile(patch)
      .pipe(finalize(() => this._saving.set(false)))
      .subscribe({
        next: (data) => {
          this._data.set(data);
          this._editing.set(false);
        },
        error: (error: unknown) => this._saveError.set(toUserMessage(error)),
      });
  }
}
