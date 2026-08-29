import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../../../shared/ui/icon/icon';

/** Category dropdown stays decorative — no per-category filter exists yet (see CLAUDE.md §24). */
@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  private readonly router = inject(Router);

  protected readonly searchTerm = signal('');

  protected onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected submitSearch(): void {
    const term = this.searchTerm().trim();
    this.router.navigate(['/courses'], term ? { queryParams: { search: term } } : {});
  }
}
