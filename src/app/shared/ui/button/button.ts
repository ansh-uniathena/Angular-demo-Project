import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button
      class="btn"
      [class.btn--full]="fullWidth()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
    >
      <span class="btn__label"><ng-content /></span>
      @if (loading()) {
        <span class="btn__spinner" aria-hidden="true"></span>
      } @else {
        <app-icon name="chevron-right" [size]="18" />
      }
    </button>
  `,
  styleUrl: './button.scss',
})
export class Button {
  readonly type = input<'button' | 'submit'>('button');
  readonly fullWidth = input(true);
  readonly disabled = input(false);
  readonly loading = input(false);
}
