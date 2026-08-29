import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * Split-panel shell shared by Login, Register, Forgot Password, OTP and Set
 * Password (confirmed identical across those 5 mockups). Lock Screen is a
 * different, centered layout and is intentionally NOT nested under this
 * component — see auth.routes.ts.
 */
@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
