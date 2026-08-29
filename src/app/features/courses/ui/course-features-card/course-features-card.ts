import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CourseFeatureSummary } from '../../data-access/course-detail.model';
import { Icon, IconName } from '../../../../shared/ui/icon/icon';

interface FeatureRow {
  icon: IconName;
  label: string;
}

@Component({
  selector: 'app-course-features-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="features-card">
      <h2>Course Features</h2>
      <ul>
        @for (row of rows(); track row.label) {
          <li>
            <app-icon [name]="row.icon" [size]="16" />
            {{ row.label }}
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './course-features-card.scss',
})
export class CourseFeaturesCard {
  readonly features = input.required<CourseFeatureSummary>();

  protected readonly rows = computed<FeatureRow[]>(() => {
    const f = this.features();
    return [
      { icon: 'users', label: f.enrolledLabel },
      { icon: 'clock', label: f.durationLabel },
      { icon: 'bar-chart', label: `Chapters: ${f.chaptersCount}` },
      { icon: 'play', label: f.videoDurationLabel },
      { icon: 'badge-check', label: `Level: ${f.level}` },
    ];
  });
}
