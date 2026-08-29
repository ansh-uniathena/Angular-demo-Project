import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../../../shared/ui/icon/icon';

const BULLETS = [
  'Access Your Class anywhere',
  'Flexible Course Plan',
  'Quality Assurance',
  'The Most World Class Instructors',
];

@Component({
  selector: 'app-mentor-cta-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './mentor-cta-section.html',
  styleUrl: './mentor-cta-section.scss',
})
export class MentorCtaSection {
  protected readonly bullets = BULLETS;
}
