import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CheckboxOptionList } from '../../../../shared/ui/checkbox-option-list/checkbox-option-list';
import { CollapsibleSection } from '../../../../shared/ui/collapsible-section/collapsible-section';
import { PriceRangeSlider } from '../../../../shared/ui/price-range-slider/price-range-slider';
import { CourseFilters } from '../../data-access/course-filters.model';

/** Instructors facet is display-only for now — no course in the mock catalog needs per-instructor filtering yet; wire it up like categoryToggled when that's needed. */
@Component({
  selector: 'app-filter-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CollapsibleSection, CheckboxOptionList, PriceRangeSlider],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
})
export class FilterSidebar {
  readonly filters = input.required<CourseFilters>();
  readonly selectedCategoryIds = input<string[]>([]);
  readonly selectedLevelIds = input<string[]>([]);
  readonly selectedPriceOptionId = input('all');

  readonly categoryToggled = output<string>();
  readonly levelToggled = output<string>();
  readonly priceOptionSelected = output<string>();
  readonly priceRangeChanged = output<{ min: number; max: number }>();
}
