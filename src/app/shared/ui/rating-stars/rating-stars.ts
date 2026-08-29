import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-rating-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <span class="rating-stars">
      @for (filled of stars(); track $index) {
        <app-icon name="star" [filled]="filled" [size]="14" />
      }
      <span class="rating-stars__value">{{ rating().toFixed(1) }}</span>
      @if (reviewCount() !== null) {
        <span class="rating-stars__count">({{ reviewCount() }})</span>
      }
    </span>
  `,
  styleUrl: './rating-stars.scss',
})
export class RatingStars {
  readonly rating = input.required<number>();
  readonly reviewCount = input<number | null>(null);

  protected readonly stars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i < Math.round(this.rating())),
  );
}
