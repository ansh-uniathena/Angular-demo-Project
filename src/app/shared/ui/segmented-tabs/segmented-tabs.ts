import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SegmentedTabOption {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-segmented-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="segmented-tabs" role="tablist">
      @for (option of options(); track option.id) {
        <button
          type="button"
          role="tab"
          class="segmented-tabs__tab"
          [class.segmented-tabs__tab--active]="option.id === activeId()"
          [attr.aria-selected]="option.id === activeId()"
          (click)="selected.emit(option.id)"
        >
          {{ option.label }} ({{ option.count.toString().padStart(2, '0') }})
        </button>
      }
    </div>
  `,
  styleUrl: './segmented-tabs.scss',
})
export class SegmentedTabs {
  readonly options = input.required<SegmentedTabOption[]>();
  readonly activeId = input.required<string>();
  readonly selected = output<string>();
}
