import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { CertificatesStore } from '../data-access/certificates.store';
import { CertificatesTable } from '../ui/certificates-table/certificates-table';

@Component({
  selector: 'app-certificates-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CertificatesStore],
  imports: [Spinner, ErrorState, CertificatesTable],
  template: `
    <div class="certificates-page">
      <h2>My Certificates</h2>
      @if (store.loading()) {
        <app-spinner />
      } @else if (store.error(); as message) {
        <app-error-state [message]="message" (retry)="store.load()" />
      } @else if (store.empty()) {
        <app-error-state message="No certificates earned yet." [retryable]="false" />
      } @else {
        <app-certificates-table [certificates]="store.data()" />
      }
    </div>
  `,
  styleUrl: './certificates.page.scss',
})
export class CertificatesPage {
  protected readonly store = inject(CertificatesStore);

  constructor() {
    this.store.load();
  }
}
