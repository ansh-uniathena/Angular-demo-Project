import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-course-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-overview.html',
  styleUrl: './course-overview.scss',
})
export class CourseOverview {
  readonly description = input.required<string>();
  readonly whatYouLearn = input.required<string[]>();
  readonly requirements = input.required<string[]>();

  protected readonly paragraphs = computed(() => this.description().split('\n\n'));
}
