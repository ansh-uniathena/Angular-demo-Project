import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SiteStats } from '../../data-access/home.model';

@Component({
  selector: 'app-stats-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats-strip.html',
  styleUrl: './stats-strip.scss',
})
export class StatsStrip {
  readonly stats = input.required<SiteStats>();
}
