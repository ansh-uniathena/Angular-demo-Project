import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../../../../shared/ui/icon/icon';
import { SiteStats } from '../../data-access/home.model';

@Component({
  selector: 'app-stats-banner-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './stats-banner-section.html',
  styleUrl: './stats-banner-section.scss',
})
export class StatsBannerSection {
  readonly stats = input.required<SiteStats>();
}
