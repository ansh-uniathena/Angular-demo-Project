import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** No pass/fail threshold was designed in Figma — 50% is an implementation default, same convention as password-strength.ts. */
const PASS_THRESHOLD = 50;

@Component({
  selector: 'app-quiz-score-ring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg width="44" height="44" viewBox="0 0 44 44" class="quiz-score-ring" [class.quiz-score-ring--low]="!passed()">
      <circle cx="22" cy="22" [attr.r]="radius" class="quiz-score-ring__track" />
      <circle
        cx="22"
        cy="22"
        [attr.r]="radius"
        class="quiz-score-ring__value"
        [attr.stroke-dasharray]="circumference"
        [attr.stroke-dashoffset]="dashOffset()"
      />
      <text x="22" y="26" text-anchor="middle" class="quiz-score-ring__label">{{ percent() }}%</text>
    </svg>
  `,
  styleUrl: './quiz-score-ring.scss',
})
export class QuizScoreRing {
  readonly percent = input.required<number>();

  protected readonly radius = RADIUS;
  protected readonly circumference = CIRCUMFERENCE;
  protected readonly passed = computed(() => this.percent() >= PASS_THRESHOLD);
  protected readonly dashOffset = computed(() => CIRCUMFERENCE * (1 - this.percent() / 100));
}
