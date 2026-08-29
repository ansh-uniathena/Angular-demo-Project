import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Testimonial } from '../../data-access/home.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-testimonial-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './testimonial-section.html',
  styleUrl: './testimonial-section.scss',
})
export class TestimonialSection {
  readonly testimonials = input.required<Testimonial[]>();

  private readonly index = signal(0);
  protected readonly active = computed(() => this.testimonials()[this.index()] ?? null);

  protected previous(): void {
    const total = this.testimonials().length;
    this.index.update((i) => (i - 1 + total) % total);
  }

  protected next(): void {
    const total = this.testimonials().length;
    this.index.update((i) => (i + 1) % total);
  }
}
