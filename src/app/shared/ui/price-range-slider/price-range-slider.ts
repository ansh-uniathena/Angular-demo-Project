import { ChangeDetectionStrategy, Component, OnInit, computed, input, output, signal } from '@angular/core';

/**
 * Dual-thumb range slider built from two overlaid native `<input type=range>`
 * elements (the standard lightweight technique — each input's track is
 * transparent so only its thumb is visually/interactively present).
 */
@Component({
  selector: 'app-price-range-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './price-range-slider.html',
  styleUrl: './price-range-slider.scss',
})
export class PriceRangeSlider implements OnInit {
  readonly min = input(0);
  readonly max = input(1000);
  readonly rangeChange = output<{ min: number; max: number }>();

  protected readonly low = signal(0);
  protected readonly high = signal(1000);

  ngOnInit(): void {
    // Inputs aren't guaranteed bound during construction — reading them
    // there would silently use the default instead of the caller's value.
    this.low.set(this.min());
    this.high.set(this.max());
  }

  protected readonly lowPercent = computed(() => this.percentOf(this.low()));
  protected readonly highPercent = computed(() => this.percentOf(this.high()));

  private percentOf(value: number): number {
    const span = this.max() - this.min() || 1;
    return ((value - this.min()) / span) * 100;
  }

  protected onLowInput(event: Event): void {
    const value = Math.min(Number((event.target as HTMLInputElement).value), this.high());
    this.low.set(value);
    this.rangeChange.emit({ min: value, max: this.high() });
  }

  protected onHighInput(event: Event): void {
    const value = Math.max(Number((event.target as HTMLInputElement).value), this.low());
    this.high.set(value);
    this.rangeChange.emit({ min: this.low(), max: value });
  }
}
