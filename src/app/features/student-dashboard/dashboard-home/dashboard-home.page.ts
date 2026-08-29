import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CourseCatalogCard } from '../../../shared/ui/course-catalog-card/course-catalog-card';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { SectionHeading } from '../../../shared/ui/section-heading/section-heading';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { DashboardHomeStore } from '../data-access/dashboard-home.store';
import { ContinueQuizBanner } from '../ui/continue-quiz-banner/continue-quiz-banner';
import { LatestQuizzesList } from '../ui/latest-quizzes-list/latest-quizzes-list';
import { RecentInvoicesList } from '../ui/recent-invoices-list/recent-invoices-list';
import { StatCard } from '../ui/stat-card/stat-card';

@Component({
  selector: 'app-dashboard-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardHomeStore],
  imports: [
    Spinner,
    ErrorState,
    ContinueQuizBanner,
    StatCard,
    SectionHeading,
    CourseCatalogCard,
    RecentInvoicesList,
    LatestQuizzesList,
  ],
  templateUrl: './dashboard-home.page.html',
  styleUrl: './dashboard-home.page.scss',
})
export class DashboardHomePage {
  protected readonly store = inject(DashboardHomeStore);

  constructor() {
    this.store.load();
  }

  protected onFavoriteToggled(_id: string): void {
    // No wishlist persistence yet — same documented no-op used elsewhere.
  }
}
