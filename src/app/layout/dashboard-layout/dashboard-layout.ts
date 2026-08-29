import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { PageBanner } from '../../shared/ui/page-banner/page-banner';
import { DashboardSidebar } from './dashboard-sidebar/dashboard-sidebar';
import { ProfileBanner } from './profile-banner/profile-banner';

/** Shell for /student/* — sidebar + profile banner, page title read from each leaf route's `data.title`. */
@Component({
  selector: 'app-dashboard-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, PageBanner, ProfileBanner, DashboardSidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.leafTitle()),
    ),
    { initialValue: this.leafTitle() },
  );

  private leafTitle(): string {
    let leaf = this.route.snapshot;
    while (leaf.firstChild) leaf = leaf.firstChild;
    return (leaf.data['title'] as string | undefined) ?? 'Dashboard';
  }
}
