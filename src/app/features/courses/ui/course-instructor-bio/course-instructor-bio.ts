import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InstructorBio } from '../../data-access/course-detail.model';
import { Icon } from '../../../../shared/ui/icon/icon';
import { RatingStars } from '../../../../shared/ui/rating-stars/rating-stars';

@Component({
  selector: 'app-course-instructor-bio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RatingStars],
  templateUrl: './course-instructor-bio.html',
  styleUrl: './course-instructor-bio.scss',
})
export class CourseInstructorBio {
  readonly instructor = input.required<InstructorBio>();
}
