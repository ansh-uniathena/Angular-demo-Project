import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

export type CatalogView = 'grid' | 'list';

export interface SortOption {
  value: string;
  label: string;
}

/**
 * Filter label + Clear, results count, grid/list toggle, sort dropdown,
 * search — the exact toolbar structure confirmed on Course Grid/List and
 * pre-declared in CLAUDE.md §1/§11 as shared between Courses and
 * Instructors, so it lives in shared/ui from the start rather than waiting
 * for a second feature to need it. Deliberately generic (string sort
 * values, no Course-specific types) — shared/ui carries no feature
 * knowledge per CLAUDE.md §4.
 */
@Component({
  selector: 'app-catalog-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './catalog-toolbar.html',
  styleUrl: './catalog-toolbar.scss',
})
export class CatalogToolbar {
  readonly resultsLabel = input.required<string>();
  readonly hasActiveFilters = input(false);
  readonly view = input.required<CatalogView>();
  readonly sortOptions = input.required<SortOption[]>();
  readonly sortValue = input.required<string>();
  readonly searchValue = input('');

  readonly clearFilters = output<void>();
  readonly viewChange = output<CatalogView>();
  readonly sortChange = output<string>();
  readonly searchChange = output<string>();

  protected onSortChange(event: Event): void {
    this.sortChange.emit((event.target as HTMLSelectElement).value);
  }

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
