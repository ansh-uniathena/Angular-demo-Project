import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { HomeApiService } from './home-api.service';
import { HomePageData } from './home.model';

/** Route-scoped facade for the home page — provided by HomePage, not root. */
@Injectable()
export class HomeStore {
  private readonly api = inject(HomeApiService);

  private readonly _data = signal<HomePageData | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._data() === null);

  readonly featuredCourses = computed(() => this._data()?.courses.slice(0, 6) ?? []);
  readonly trendingCourses = computed(() => this._data()?.courses.filter((c) => c.trending) ?? []);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api
      .getHomePageData()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => this._data.set(data),
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }
}
