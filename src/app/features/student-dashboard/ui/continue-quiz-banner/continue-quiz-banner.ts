import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InProgressQuiz } from '../../data-access/dashboard-summary.model';

@Component({
  selector: 'app-continue-quiz-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="continue-quiz">
      <div>
        <p class="continue-quiz__title">Quiz : {{ quiz().title }}</p>
        <p class="continue-quiz__meta">Answered : {{ quiz().answeredCount }}/{{ quiz().totalCount }}</p>
      </div>
      <button type="button" class="continue-quiz__button">Continue Quiz</button>
    </div>
  `,
  styleUrl: './continue-quiz-banner.scss',
})
export class ContinueQuizBanner {
  readonly quiz = input.required<InProgressQuiz>();
}
