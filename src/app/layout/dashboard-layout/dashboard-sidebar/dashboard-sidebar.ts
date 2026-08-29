import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Icon, IconName } from '../../../shared/ui/icon/icon';

interface SidebarLink {
  label: string;
  link: string;
  icon: IconName;
}

// Only Dashboard/My Profile/Enrolled Courses/My Certificates/My Quiz
// Attempts are built (the 5 provided mockups) — the rest link out to
// routes that don't exist yet and fall through to the wildcard redirect,
// same documented-gap convention as the header's nav dropdowns.
const MAIN_LINKS: SidebarLink[] = [
  { label: 'Dashboard', link: '/student', icon: 'grid' },
  { label: 'My Profile', link: '/student/profile', icon: 'user' },
  { label: 'Enrolled Courses', link: '/student/enrolled-courses', icon: 'book' },
  { label: 'My Certificates', link: '/student/certificates', icon: 'badge-check' },
  { label: 'Wishlist', link: '/student/wishlist', icon: 'heart' },
  { label: 'Reviews', link: '/student/reviews', icon: 'star' },
  { label: 'My Quiz Attempts', link: '/student/quiz-attempts', icon: 'clipboard-check' },
  { label: 'Order History', link: '/student/order-history', icon: 'cart' },
  { label: 'Referrals', link: '/student/referrals', icon: 'gift' },
  { label: 'Messages', link: '/student/messages', icon: 'message' },
  { label: 'Support Tickets', link: '/student/support-tickets', icon: 'ticket' },
];

@Component({
  selector: 'app-dashboard-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
  protected readonly mainLinks = MAIN_LINKS;

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
