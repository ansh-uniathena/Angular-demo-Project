import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * Presentational only — no OAuth provider is wired up (nothing in the design
 * or requirements specifies one). Pages receive the click and currently
 * no-op; swap in a real provider redirect there once one exists.
 */
@Component({
  selector: 'app-social-auth-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-auth-buttons.html',
  styleUrl: './social-auth-buttons.scss',
})
export class SocialAuthButtons {
  readonly google = output<void>();
  readonly facebook = output<void>();
}
