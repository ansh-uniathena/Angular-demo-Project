import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { Icon } from '../icon/icon';
import { RatingStars } from '../rating-stars/rating-stars';

/**
 * Grid vs List (Course Grid / Course List) share one card, one dataset —
 * confirmed pattern, CLAUDE.md §1. Promoted from features/courses/ui/ to
 * shared/ui/ once student-dashboard needed it too (Recently Enrolled
 * Courses, Enrolled Courses) — per CLAUDE.md §6's "shared once a second
 * feature needs it" rule.
 */
@Component({
  selector: 'app-course-catalog-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, RatingStars],
  templateUrl: './course-catalog-card.html',
  styleUrl: './course-catalog-card.scss',
})
export class CourseCatalogCard {
  readonly course = input.required<Course>();
  readonly layout = input<'grid' | 'list'>('grid');
  readonly favoriteToggled = output<string>();

  protected readonly ctaLabel = computed(() => (this.layout() === 'grid' ? 'View Course' : 'Get Course'));
}
