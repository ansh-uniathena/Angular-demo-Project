import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, IconName } from '../../../../shared/ui/icon/icon';

export type StatCardVariant = 'indigo' | 'pink' | 'green';

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="stat-card" [class]="'stat-card--' + variant()">
      <span class="stat-card__icon"><app-icon [name]="icon()" [size]="22" /></span>
      <div>
        <p class="stat-card__label">{{ label() }}</p>
        <p class="stat-card__value">{{ value() }}</p>
      </div>
    </div>
  `,
  styleUrl: './stat-card.scss',
})
export class StatCard {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly variant = input<StatCardVariant>('indigo');
}
