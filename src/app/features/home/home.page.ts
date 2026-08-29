import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeStore } from './data-access/home.store';
import { BlogSection } from './ui/blog-section/blog-section';
import { CareerSection } from './ui/career-section/career-section';
import { CategorySection } from './ui/category-section/category-section';
import { CourseGridSection } from './ui/course-grid-section/course-grid-section';
import { DualCtaSection } from './ui/dual-cta-section/dual-cta-section';
import { HeroSection } from './ui/hero-section/hero-section';
import { InstructorSection } from './ui/instructor-section/instructor-section';
import { MentorCtaSection } from './ui/mentor-cta-section/mentor-cta-section';
import { PartnersSection } from './ui/partners-section/partners-section';
import { StatsBannerSection } from './ui/stats-banner-section/stats-banner-section';
import { StatsStrip } from './ui/stats-strip/stats-strip';
import { TestimonialSection } from './ui/testimonial-section/testimonial-section';
import { TrustedBySection } from './ui/trusted-by-section/trusted-by-section';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { Spinner } from '../../shared/ui/spinner/spinner';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeStore],
  imports: [
    HeroSection,
    StatsStrip,
    CategorySection,
    CourseGridSection,
    CareerSection,
    InstructorSection,
    TrustedBySection,
    MentorCtaSection,
    TestimonialSection,
    DualCtaSection,
    BlogSection,
    StatsBannerSection,
    PartnersSection,
    Spinner,
    ErrorState,
  ],
  templateUrl: './home.page.html',
})
export class HomePage {
  protected readonly store = inject(HomeStore);

  constructor() {
    this.store.load();
  }

  protected onFavoriteToggled(_id: string): void {
    // Favoriting has no persistence yet — wire to a real endpoint once
    // Courses/Instructors features exist. Intentionally a no-op for now.
  }
}
