import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon, IconName } from '../../../shared/ui/icon/icon';

interface FooterLink {
  label: string;
  link: string;
}

// Login/Register point at the real auth routes. Everything else here
// (Search Mentors, Booking, Appointments, Chat, both Dashboards) has no
// built destination yet — kept pointing at "/" rather than a dead link,
// same documented-gap convention used elsewhere. See CLAUDE.md §24.
const FOR_INSTRUCTOR_LINKS: FooterLink[] = [
  { label: 'Search Mentors', link: '/' },
  { label: 'Login', link: '/auth/login' },
  { label: 'Register', link: '/auth/register' },
  { label: 'Booking', link: '/' },
  { label: 'Students', link: '/' },
  { label: 'Dashboard', link: '/' },
];
const FOR_STUDENT_LINKS: FooterLink[] = [
  { label: 'Appointments', link: '/' },
  { label: 'Chat', link: '/' },
  { label: 'Login', link: '/auth/login' },
  { label: 'Register', link: '/auth/register' },
  { label: 'Instructor Dashboard', link: '/' },
];
const SOCIAL_ICONS: IconName[] = ['facebook', 'instagram', 'linkedin', 'twitter-x'];

/**
 * White content area + navy bottom bar — confirmed via Ui-Image/auth.css
 * against the Course Grid/List/Detail exports (identical across all 4),
 * supersedes the earlier "Support/About/Useful Links" guess built from
 * Home Page 12.jpg alone. See CLAUDE.md §1.
 */
@Component({
  selector: 'app-public-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class PublicFooter {
  protected readonly forInstructorLinks = FOR_INSTRUCTOR_LINKS;
  protected readonly forStudentLinks = FOR_STUDENT_LINKS;
  protected readonly socialIcons = SOCIAL_ICONS;
  protected readonly year = new Date().getFullYear();
}
