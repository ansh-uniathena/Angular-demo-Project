export interface QuizAttemptListItem {
  id: string;
  courseTitle: string;
  questionCount: number;
  /** True once the student has taken this quiz at least once — drives the CTA styling (attempt vs. review). */
  attempted: boolean;
}
