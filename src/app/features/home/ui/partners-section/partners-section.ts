import { ChangeDetectionStrategy, Component } from '@angular/core';

/** No partner logo assets were provided — rendered as text wordmarks, same approach as trusted-by-section. */
@Component({
  selector: 'app-partners-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partners-section.html',
  styleUrl: './partners-section.scss',
})
export class PartnersSection {
  protected readonly partners = ['Salesforce', 'Sketch', 'Webflow', 'Coda', 'Pendo', 'Typeform'];
}
