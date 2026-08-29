import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Icon } from '../../../shared/ui/icon/icon';

/**
 * Identical banner across all 5 dashboard screens. "Become an Instructor" /
 * "Instructor Dashboard" are presentational — no instructor-application flow
 * or instructor dashboard exists yet (falls through to the wildcard route),
 * same documented-gap convention used elsewhere.
 */
@Component({
  selector: 'app-profile-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './profile-banner.html',
  styleUrl: './profile-banner.scss',
})
export class ProfileBanner {
  protected readonly auth = inject(AuthService);
}
