import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorState } from '../../shared/ui/error-state/error-state';

/** Guard-rejection target for authGuard/roleGuard — required by CLAUDE.md §5. */
@Component({
  selector: 'app-unauthorized-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorState],
  template: `
    <app-error-state
      message="You don't have access to this page."
      [retryable]="false"
    />
  `,
})
export class UnauthorizedPage {}
