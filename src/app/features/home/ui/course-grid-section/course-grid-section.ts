import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Course } from '../../../../shared/models/course.model';
import { CourseCard } from '../../../../shared/ui/course-card/course-card';
import { SectionHeading } from '../../../../shared/ui/section-heading/section-heading';

@Component({
  selector: 'app-course-grid-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, CourseCard],
  templateUrl: './course-grid-section.html',
  styleUrl: './course-grid-section.scss',
})
export class CourseGridSection {
  readonly eyebrow = input('What\'s New');
  readonly title = input.required<string>();
  readonly ctaLabel = input.required<string>();
  readonly courses = input.required<Course[]>();
  readonly favoriteToggled = output<string>();
}
