import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CourseCatalogCard } from '../../../shared/ui/course-catalog-card/course-catalog-card';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { SegmentedTabOption, SegmentedTabs } from '../../../shared/ui/segmented-tabs/segmented-tabs';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { EnrolledCoursesFilter } from '../data-access/enrolled-course.model';
import { EnrolledCoursesStore } from '../data-access/enrolled-courses.store';

@Component({
  selector: 'app-enrolled-courses-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EnrolledCoursesStore],
  imports: [SegmentedTabs, CourseCatalogCard, Pagination, Spinner, ErrorState],
  templateUrl: './enrolled-courses.page.html',
  styleUrl: './enrolled-courses.page.scss',
})
export class EnrolledCoursesPage {
  protected readonly store = inject(EnrolledCoursesStore);

  protected readonly tabOptions = computed<SegmentedTabOption[]>(() => {
    const counts = this.store.counts();
    return [
      { id: 'enrolled', label: 'Enrolled', count: counts.enrolled },
      { id: 'active', label: 'Active', count: counts.active },
      { id: 'completed', label: 'Completed', count: counts.completed },
    ];
  });

  constructor() {
    this.store.load();
  }

  protected onFavoriteToggled(_id: string): void {
    // No wishlist persistence yet — same documented no-op used elsewhere.
  }

  protected onTabSelected(id: string): void {
    this.store.setFilter(id as EnrolledCoursesFilter);
  }
}
