import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QuizAttemptListItem } from '../../data-access/quiz-attempt.model';
import { Icon } from '../../../../shared/ui/icon/icon';

/**
 * Red arrow = not yet attempted (call to action), dark arrow = already
 * attempted (review). Figma didn't label this distinction explicitly —
 * inferred from the one red vs. five dark arrows in the mockup, a
 * reasonable product pattern. See CLAUDE.md §23.
 */
@Component({
  selector: 'app-quiz-attempt-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <ul class="quiz-attempt-list">
      @for (item of items(); track item.id) {
        <li>
          <div>
            <p class="quiz-attempt-list__title">{{ item.courseTitle }}</p>
            <p class="quiz-attempt-list__meta">
              Number of Questions : {{ item.questionCount.toString().padStart(2, '0') }}
            </p>
          </div>
          <button
            type="button"
            class="quiz-attempt-list__cta"
            [class.quiz-attempt-list__cta--pending]="!item.attempted"
            [attr.aria-label]="item.attempted ? 'Review attempt' : 'Start quiz'"
          >
            <app-icon name="arrow-right" [size]="16" />
          </button>
        </li>
      }
    </ul>
  `,
  styleUrl: './quiz-attempt-list.scss',
})
export class QuizAttemptList {
  readonly items = input.required<QuizAttemptListItem[]>();
}
