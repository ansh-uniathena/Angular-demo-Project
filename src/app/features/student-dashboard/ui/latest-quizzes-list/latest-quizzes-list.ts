import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QuizResult } from '../../data-access/dashboard-summary.model';
import { QuizScoreRing } from '../quiz-score-ring/quiz-score-ring';

@Component({
  selector: 'app-latest-quizzes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuizScoreRing],
  template: `
    <div class="latest-quizzes-card">
      <h2>Latest Quizes</h2>
      <ul>
        @for (result of results(); track result.id) {
          <li>
            <div>
              <p class="latest-quizzes-card__title">{{ result.quizTitle }}</p>
              <p class="latest-quizzes-card__meta">
                Correct Answer : {{ result.correctCount }}/{{ result.totalCount }} &bull; Date :
                {{ result.dateLabel }}
              </p>
            </div>
            <app-quiz-score-ring [percent]="result.scorePercent" />
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './latest-quizzes-list.scss',
})
export class LatestQuizzesList {
  readonly results = input.required<QuizResult[]>();
}
