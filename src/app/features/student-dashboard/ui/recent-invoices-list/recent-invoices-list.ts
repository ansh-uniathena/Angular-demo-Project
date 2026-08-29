import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Invoice } from '../../data-access/dashboard-summary.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-recent-invoices-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="invoices-card">
      <h2>Recent Invoices</h2>
      <ul>
        @for (invoice of invoices(); track invoice.id) {
          <li>
            <div>
              <p class="invoices-card__name">{{ invoice.courseName }}</p>
              <p class="invoices-card__meta">
                #{{ invoice.invoiceNumber }} &bull; Amount : <span>&#36;{{ invoice.amount }}</span>
              </p>
            </div>
            <div class="invoices-card__actions">
              <span class="invoices-card__status">&bull; Paid</span>
              <button type="button" aria-label="Download invoice"><app-icon name="download" [size]="14" /></button>
            </div>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './recent-invoices-list.scss',
})
export class RecentInvoicesList {
  readonly invoices = input.required<Invoice[]>();
}
