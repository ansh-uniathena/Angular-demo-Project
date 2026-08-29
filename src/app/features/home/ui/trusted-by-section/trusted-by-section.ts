import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Only the Jira mark was provided as a clean asset (Ui-Image/Container.png
 * has the rest baked into a flattened screenshot, unusable as a real
 * asset — see CLAUDE.md). The remaining brands render as plain wordmarks
 * rather than hand-drawn trademarked logos.
 */
@Component({
  selector: 'app-trusted-by-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trusted-by-section.html',
  styleUrl: './trusted-by-section.scss',
})
export class TrustedBySection {
  protected readonly wordmarkBrands = ['Calendly', 'LiveChat', 'Dropbox', 'Mixpanel', 'Make'];
}
