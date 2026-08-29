import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CourseDetail } from '../../data-access/course-detail.model';
import { Icon } from '../../../../shared/ui/icon/icon';
import { RatingStars } from '../../../../shared/ui/rating-stars/rating-stars';

/** Dark overlay hero — the "Course Detail 1" variant (Ui-Image/Course Detail 3.jpg). See CLAUDE.md §1. */
@Component({
  selector: 'app-course-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RatingStars],
  templateUrl: './course-hero.html',
  styleUrl: './course-hero.scss',
})
export class CourseHero {
  readonly course = input.required<CourseDetail>();

  protected readonly summary = computed(() => this.course().description.split('\n\n')[0]);
  protected readonly studentsLabel = computed(() => `${this.course().studentsEnrolledCount} students enrolled`);
}
