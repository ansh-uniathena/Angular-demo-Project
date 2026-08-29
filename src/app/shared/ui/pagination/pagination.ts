import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

const MAX_VISIBLE_PAGES = 5;

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= MAX_VISIBLE_PAGES) return range(1, total);
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + MAX_VISIBLE_PAGES - 1);
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    return range(start, end);
  });

  protected go(page: number): void {
    this.pageChange.emit(page);
  }
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
