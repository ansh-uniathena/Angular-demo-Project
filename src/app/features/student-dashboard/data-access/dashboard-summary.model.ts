import { Course } from '../../../shared/models/course.model';

export interface DashboardStats {
  enrolledCourses: number;
  activeCourses: number;
  completedCourses: number;
}

export interface InProgressQuiz {
  title: string;
  answeredCount: number;
  totalCount: number;
}

export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  courseName: string;
  amount: number;
  status: InvoiceStatus;
}

export interface QuizResult {
  id: string;
  quizTitle: string;
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  dateLabel: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  inProgressQuiz: InProgressQuiz | null;
  recentlyEnrolledCourses: Course[];
  recentInvoices: Invoice[];
  latestQuizResults: QuizResult[];
}
