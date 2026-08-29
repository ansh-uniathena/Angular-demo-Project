import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page-banner">
      <h1>{{ title() }}</h1>
      <nav class="page-banner__crumbs" aria-label="Breadcrumb">
        <a routerLink="/">Home</a>
        <span class="page-banner__divider"></span>
        <span>{{ title() }}</span>
      </nav>
    </div>
  `,
  styleUrl: './page-banner.scss',
})
export class PageBanner {
  readonly title = input.required<string>();
}
