import { ChangeDetectionStrategy, Component, OnInit, input, signal } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-collapsible-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="collapsible-section">
      <button
        type="button"
        class="collapsible-section__header"
        [attr.aria-expanded]="expanded()"
        (click)="expanded.set(!expanded())"
      >
        <span>{{ title() }}</span>
        <app-icon name="chevron-down" [size]="16" [class.collapsible-section__chevron--open]="expanded()" />
      </button>
      @if (expanded()) {
        <div class="collapsible-section__body">
          <ng-content />
        </div>
      }
    </div>
  `,
  styleUrl: './collapsible-section.scss',
})
export class CollapsibleSection implements OnInit {
  readonly title = input.required<string>();
  readonly startExpanded = input(true);

  protected readonly expanded = signal(true);

  ngOnInit(): void {
    this.expanded.set(this.startExpanded());
  }
}
