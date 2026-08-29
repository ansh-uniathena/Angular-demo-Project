import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="spinner" role="status" aria-label="Loading"></span>`,
  styleUrl: './spinner.scss',
})
export class Spinner {}
