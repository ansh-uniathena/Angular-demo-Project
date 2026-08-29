import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

export interface CheckboxOption {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-checkbox-option-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <ul class="checkbox-option-list">
      @for (option of options(); track option.id) {
        <li>
          <label class="checkbox-option-list__item">
            <span
              class="checkbox-option-list__box"
              [class.checkbox-option-list__box--checked]="selectedIds().includes(option.id)"
            >
              @if (selectedIds().includes(option.id)) {
                <app-icon name="check" [size]="10" />
              }
            </span>
            <input
              type="checkbox"
              class="checkbox-option-list__input"
              [checked]="selectedIds().includes(option.id)"
              (change)="toggled.emit(option.id)"
            />
            <span class="checkbox-option-list__label">{{ option.label }}</span>
            <span class="checkbox-option-list__count">({{ option.count }})</span>
          </label>
        </li>
      }
    </ul>
  `,
  styleUrl: './checkbox-option-list.scss',
})
export class CheckboxOptionList {
  readonly options = input.required<CheckboxOption[]>();
  readonly selectedIds = input<string[]>([]);
  readonly toggled = output<string>();
}
