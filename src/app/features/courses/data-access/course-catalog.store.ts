import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { Course } from '../../../shared/models/course.model';
import { CourseApiService } from './course-api.service';
import { CourseFilters } from './course-filters.model';
import { CourseListRequest, CourseSort, CourseView } from './course-query.model';

const PAGE_SIZE = 9;
const SEARCH_DEBOUNCE_MS = 300;

/** Route-scoped facade backing the combined Course Grid/List page — one dataset, two view renderers (CLAUDE.md §1). */
@Injectable()
export class CourseCatalogStore {
  private readonly api = inject(CourseApiService);
  private readonly requestTrigger = new Subject<void>();

  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _courses = signal<Course[]>([]);
  private readonly _total = signal(0);
  private readonly _filters = signal<CourseFilters | null>(null);

  private readonly _view = signal<CourseView>('grid');
  private readonly _page = signal(1);
  private readonly _sort = signal<CourseSort>('newest');
  private readonly _search = signal('');
  private readonly _categoryIds = signal<string[]>([]);
  private readonly _levelIds = signal<string[]>([]);
  private readonly _priceOptionId = signal('all');

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly courses = this._courses.asReadonly();
  readonly total = this._total.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly empty = computed(() => !this._loading() && !this._error() && this._courses().length === 0);

  readonly view = this._view.asReadonly();
  readonly page = this._page.asReadonly();
  readonly sort = this._sort.asReadonly();
  readonly search = this._search.asReadonly();
  readonly categoryIds = this._categoryIds.asReadonly();
  readonly levelIds = this._levelIds.asReadonly();
  readonly priceOptionId = this._priceOptionId.asReadonly();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this._total() / PAGE_SIZE)));
  readonly showingLabel = computed(() => {
    const total = this._total();
    if (total === 0) return 'Showing 0 results';
    const start = (this._page() - 1) * PAGE_SIZE + 1;
    const end = Math.min(start + PAGE_SIZE - 1, total);
    return `Showing ${start}-${end} of ${total} results`;
  });
  readonly hasActiveFilters = computed(
    () =>
      this._categoryIds().length > 0 ||
      this._levelIds().length > 0 ||
      this._priceOptionId() !== 'all' ||
      this._search().length > 0,
  );

  constructor() {
    this.requestTrigger
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        switchMap(() => {
          this._loading.set(true);
          this._error.set(null);
          const request: CourseListRequest = {
            page: this._page(),
            pageSize: PAGE_SIZE,
            search: this._search() || undefined,
            sort: this._sort(),
            categoryIds: this._categoryIds(),
            levelIds: this._levelIds(),
            priceOptionId: this._priceOptionId(),
          };
          return this.api.getCourses(request).pipe(finalize(() => this._loading.set(false)));
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (response) => {
          this._courses.set(response.items);
          this._total.set(response.total);
          this._filters.set(response.filters);
        },
        error: (error: unknown) => this._error.set(toUserMessage(error)),
      });
  }

  /** `initialSearch` seeds the search box on first load — e.g. arriving from the Home hero search via `?search=`. */
  load(initialSearch?: string): void {
    if (initialSearch !== undefined) this._search.set(initialSearch);
    this.requestTrigger.next();
  }

  setView(view: CourseView): void {
    this._view.set(view);
  }

  setSort(sort: CourseSort): void {
    this._sort.set(sort);
    this._page.set(1);
    this.requestTrigger.next();
  }

  setSearch(value: string): void {
    this._search.set(value);
    this._page.set(1);
    this.requestTrigger.next();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this._page.set(page);
    this.requestTrigger.next();
  }

  toggleCategory(id: string): void {
    this._categoryIds.update((ids) => toggle(ids, id));
    this._page.set(1);
    this.requestTrigger.next();
  }

  toggleLevel(id: string): void {
    this._levelIds.update((ids) => toggle(ids, id));
    this._page.set(1);
    this.requestTrigger.next();
  }

  setPriceOption(id: string): void {
    this._priceOptionId.set(id);
    this._page.set(1);
    this.requestTrigger.next();
  }

  clearFilters(): void {
    this._categoryIds.set([]);
    this._levelIds.set([]);
    this._priceOptionId.set('all');
    this._search.set('');
    this._page.set(1);
    this.requestTrigger.next();
  }
}

function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}
