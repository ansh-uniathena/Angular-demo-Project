import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Icon, IconName } from '../../../shared/ui/icon/icon';

interface NavItem {
  label: string;
  link: string;
  hasDropdown: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', link: '/', hasDropdown: false },
  { label: 'Courses', link: '/courses', hasDropdown: true },
  { label: 'Instructors', link: '/instructors', hasDropdown: true },
  { label: 'Pages', link: '/pages', hasDropdown: true },
  { label: 'Blog', link: '/blog', hasDropdown: true },
  { label: 'Contact us', link: '/contact', hasDropdown: false },
];

const SOCIAL_ICONS: IconName[] = ['facebook', 'instagram', 'linkedin', 'twitter-x'];

/**
 * Two-row header (utility bar + main nav), confirmed via Ui-Image/auth.css
 * against the Course Grid/List/Detail exports — supersedes the earlier,
 * lower-fidelity guess built from Home Page 12.jpg alone (see CLAUDE.md §1).
 * The nav's dropdown chevrons are visual only — Courses/Instructors/Pages/
 * Blog sub-menus, the theme toggle, and the cart are not built yet;
 * clicking through to an unbuilt route lands on the wildcard redirect.
 */
@Component({
  selector: 'app-public-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class PublicHeader {
  protected readonly navItems = NAV_ITEMS;
  protected readonly socialIcons = SOCIAL_ICONS;

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.auth.currentUser;

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
