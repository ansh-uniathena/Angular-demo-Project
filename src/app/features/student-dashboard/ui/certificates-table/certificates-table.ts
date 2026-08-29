import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Certificate } from '../../data-access/certificate.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-certificates-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './certificates-table.html',
  styleUrl: './certificates-table.scss',
})
export class CertificatesTable {
  readonly certificates = input.required<Certificate[]>();
}
