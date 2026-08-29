import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogToolbar, SortOption } from '../../../shared/ui/catalog-toolbar/catalog-toolbar';
import { CourseCatalogCard } from '../../../shared/ui/course-catalog-card/course-catalog-card';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { PageBanner } from '../../../shared/ui/page-banner/page-banner';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { CourseCatalogStore } from '../data-access/course-catalog.store';
import { CourseSort, CourseView } from '../data-access/course-query.model';
import { FilterSidebar } from '../ui/filter-sidebar/filter-sidebar';

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newly Published' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

@Component({
  selector: 'app-courses-catalog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CourseCatalogStore],
  imports: [
    PageBanner,
    CatalogToolbar,
    FilterSidebar,
    CourseCatalogCard,
    Pagination,
    Spinner,
    ErrorState,
  ],
  templateUrl: './courses-catalog.page.html',
  styleUrl: './courses-catalog.page.scss',
})
export class CoursesCatalogPage {
  protected readonly store = inject(CourseCatalogStore);
  protected readonly sortOptions = SORT_OPTIONS;
  private readonly route = inject(ActivatedRoute);

  constructor() {
    // Seeds the search box when arriving with ?search=... — e.g. from the Home hero search.
    this.store.load(this.route.snapshot.queryParamMap.get('search') ?? undefined);
  }

  protected onFavoriteToggled(_id: string): void {
    // No persistence layer for wishlists yet — same documented no-op as Home's course cards.
  }

  protected onSortChange(value: string): void {
    this.store.setSort(value as CourseSort);
  }

  protected onViewChange(value: string): void {
    this.store.setView(value as CourseView);
  }
}
