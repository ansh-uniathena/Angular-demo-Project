import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Instructor } from '../../models/instructor.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-instructor-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './instructor-card.html',
  styleUrl: './instructor-card.scss',
})
export class InstructorCard {
  readonly instructor = input.required<Instructor>();
  readonly favoriteToggled = output<string>();
}
