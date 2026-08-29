import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { Icon } from '../icon/icon';
import { RatingStars } from '../rating-stars/rating-stars';

@Component({
  selector: 'app-course-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, RatingStars],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  readonly course = input.required<Course>();
  readonly favoriteToggled = output<string>();
}
