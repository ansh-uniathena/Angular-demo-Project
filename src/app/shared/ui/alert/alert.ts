import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Generic form-level status banner. Figma has no designed error/success state — see CLAUDE.md §1. */
@Component({
  selector: 'app-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <div class="alert" [class]="'alert--' + variant()" role="alert">{{ message() }}</div>
    }
  `,
  styleUrl: './alert.scss',
})
export class Alert {
  readonly message = input<string | null>(null);
  readonly variant = input<'error' | 'success'>('error');
}
