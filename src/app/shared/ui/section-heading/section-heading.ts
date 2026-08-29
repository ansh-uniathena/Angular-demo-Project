import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="section-heading">
      <div>
        @if (eyebrow()) {
          <p class="section-heading__eyebrow">{{ eyebrow() }}</p>
        }
        <h2 class="section-heading__title">{{ title() }}</h2>
      </div>
      @if (ctaLabel()) {
        <a class="section-heading__cta" [routerLink]="ctaLink()">{{ ctaLabel() }}</a>
      }
    </div>
  `,
  styleUrl: './section-heading.scss',
})
export class SectionHeading {
  readonly eyebrow = input<string | null>(null);
  readonly title = input.required<string>();
  readonly ctaLabel = input<string | null>(null);
  readonly ctaLink = input('/courses');
}
