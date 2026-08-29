import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { QuizAttemptsStore } from '../data-access/quiz-attempts.store';
import { QuizAttemptList } from '../ui/quiz-attempt-list/quiz-attempt-list';

@Component({
  selector: 'app-quiz-attempts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QuizAttemptsStore],
  imports: [Spinner, ErrorState, QuizAttemptList],
  template: `
    <div class="quiz-attempts-page">
      <h2>My Quiz Attempts</h2>
      @if (store.loading()) {
        <app-spinner />
      } @else if (store.error(); as message) {
        <app-error-state [message]="message" (retry)="store.load()" />
      } @else if (store.empty()) {
        <app-error-state message="No quizzes available yet." [retryable]="false" />
      } @else {
        <app-quiz-attempt-list [items]="store.data()" />
      }
    </div>
  `,
  styleUrl: './quiz-attempts.page.scss',
})
export class QuizAttemptsPage {
  protected readonly store = inject(QuizAttemptsStore);

  constructor() {
    this.store.load();
  }
}
