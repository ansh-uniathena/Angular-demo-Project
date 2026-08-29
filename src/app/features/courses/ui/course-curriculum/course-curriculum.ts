import { ChangeDetectionStrategy, Component, OnInit, input, signal } from '@angular/core';
import { CurriculumSection } from '../../data-access/course-detail.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-course-curriculum',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './course-curriculum.html',
  styleUrl: './course-curriculum.scss',
})
export class CourseCurriculum implements OnInit {
  readonly sections = input.required<CurriculumSection[]>();
  readonly lessonCount = input.required<number>();
  readonly durationLabel = input.required<string>();

  protected readonly expandedId = signal<string | null>(null);

  ngOnInit(): void {
    // First section open by default, matching the mockup. Inputs aren't
    // guaranteed set during construction, so this waits for ngOnInit.
    this.expandedId.set(this.sections()[0]?.id ?? null);
  }

  protected toggle(sectionId: string): void {
    this.expandedId.update((current) => (current === sectionId ? null : sectionId));
  }
}
