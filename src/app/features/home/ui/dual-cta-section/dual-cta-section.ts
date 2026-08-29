import { ChangeDetectionStrategy, Component } from '@angular/core';

interface CtaCard {
  variant: 'purple' | 'navy';
  title: string;
  subtitle: string;
  imageUrl: string | null;
}

const CARDS: CtaCard[] = [
  {
    variant: 'purple',
    title: 'Become An Instructor',
    subtitle: 'Top instructors from around the world teach millions of students on Mentoring.',
    imageUrl: '/Instructor Image.png',
  },
  {
    variant: 'navy',
    title: 'Transform Access',
    subtitle: 'Create an account to receive our newsletter course promotions.',
    // No usable photo asset was provided for this card — solid color only, see CLAUDE.md §24.
    imageUrl: null,
  },
];

@Component({
  selector: 'app-dual-cta-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dual-cta-section.html',
  styleUrl: './dual-cta-section.scss',
})
export class DualCtaSection {
  protected readonly cards = CARDS;
}
