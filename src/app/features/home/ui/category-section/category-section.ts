import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../data-access/home.model';
import { SectionHeading } from '../../../../shared/ui/section-heading/section-heading';

/**
 * Cards link to the unfiltered catalog, not a per-category filter — these
 * category names ("Angular Development" etc.) don't correspond to any real
 * `Course.category` value in the mock catalog (Design/Wordpress/
 * Programming, see CLAUDE.md §22), so pretending to filter by them would
 * be dishonest. Revisit once a real category taxonomy exists.
 */
@Component({
  selector: 'app-category-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHeading],
  templateUrl: './category-section.html',
  styleUrl: './category-section.scss',
})
export class CategorySection {
  readonly categories = input.required<Category[]>();
}
