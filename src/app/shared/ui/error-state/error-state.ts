import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-state" role="alert">
      <p>{{ message() }}</p>
      @if (retryable()) {
        <button type="button" (click)="retry.emit()">Try again</button>
      }
    </div>
  `,
  styleUrl: './error-state.scss',
})
export class ErrorState {
  readonly message = input.required<string>();
  readonly retryable = input(true);
  readonly retry = output<void>();
}
