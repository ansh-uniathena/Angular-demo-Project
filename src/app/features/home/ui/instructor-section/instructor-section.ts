import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Instructor } from '../../../../shared/models/instructor.model';
import { InstructorCard } from '../../../../shared/ui/instructor-card/instructor-card';

@Component({
  selector: 'app-instructor-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InstructorCard],
  templateUrl: './instructor-section.html',
  styleUrl: './instructor-section.scss',
})
export class InstructorSection {
  readonly instructors = input.required<Instructor[]>();
  readonly favoriteToggled = output<string>();
}
