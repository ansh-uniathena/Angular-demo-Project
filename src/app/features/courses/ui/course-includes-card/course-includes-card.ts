import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, IconName } from '../../../../shared/ui/icon/icon';

const ICON_BY_KEYWORD: { match: string; icon: IconName }[] = [
  { match: 'video', icon: 'play' },
  { match: 'download', icon: 'download' },
  { match: 'lifetime', icon: 'infinity' },
  { match: 'mobile', icon: 'devices' },
  { match: 'assignment', icon: 'clipboard-check' },
  { match: 'certificate', icon: 'badge-check' },
];

function iconFor(label: string): IconName {
  const lower = label.toLowerCase();
  return ICON_BY_KEYWORD.find((entry) => lower.includes(entry.match))?.icon ?? 'check';
}

@Component({
  selector: 'app-course-includes-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="includes-card">
      <h2>Includes</h2>
      <ul>
        @for (item of includes(); track item) {
          <li>
            <app-icon [name]="iconFor(item)" [size]="16" />
            {{ item }}
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './course-includes-card.scss',
})
export class CourseIncludesCard {
  readonly includes = input.required<string[]>();
  protected readonly iconFor = iconFor;
}
