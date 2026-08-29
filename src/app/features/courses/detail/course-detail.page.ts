import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { CourseDetailStore } from '../data-access/course-detail.store';
import { CommentRequest } from '../data-access/course-query.model';
import { CourseCommentForm } from '../ui/course-comment-form/course-comment-form';
import { CourseCurriculum } from '../ui/course-curriculum/course-curriculum';
import { CourseFeaturesCard } from '../ui/course-features-card/course-features-card';
import { CourseHero } from '../ui/course-hero/course-hero';
import { CourseIncludesCard } from '../ui/course-includes-card/course-includes-card';
import { CourseInstructorBio } from '../ui/course-instructor-bio/course-instructor-bio';
import { CourseOverview } from '../ui/course-overview/course-overview';
import { CoursePurchaseCard } from '../ui/course-purchase-card/course-purchase-card';

@Component({
  selector: 'app-course-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CourseDetailStore],
  imports: [
    Spinner,
    ErrorState,
    CourseHero,
    CourseOverview,
    CourseCurriculum,
    CourseInstructorBio,
    CourseCommentForm,
    CoursePurchaseCard,
    CourseIncludesCard,
    CourseFeaturesCard,
  ],
  templateUrl: './course-detail.page.html',
  styleUrl: './course-detail.page.scss',
})
export class CourseDetailPage {
  protected readonly store = inject(CourseDetailStore);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) this.store.load(slug);
  }

  protected onCommentSubmitted(payload: CommentRequest): void {
    this.store.submitComment(payload);
  }

  protected onFavoriteToggled(): void {
    // No wishlist persistence yet — same documented no-op pattern used elsewhere.
  }
}
