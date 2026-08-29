import { Course } from '../../../shared/models/course.model';

export interface CurriculumLecture {
  id: string;
  title: string;
  durationLabel: string;
  preview: boolean;
}

export interface CurriculumSection {
  id: string;
  title: string;
  lectures: CurriculumLecture[];
}

export interface InstructorBio {
  name: string;
  avatarUrl: string;
  title: string;
  rating: number;
  reviewCount: number;
  courseCount: number;
  lessonCount: number;
  durationLabel: string;
  studentsEnrolledLabel: string;
  bio: string;
  skills: string[];
  availableFor: string[];
}

export interface CourseFeatureSummary {
  enrolledLabel: string;
  durationLabel: string;
  chaptersCount: number;
  videoDurationLabel: string;
  level: string;
}

export interface CourseDetail extends Course {
  heroImageUrl: string;
  discountLabel: string | null;
  studentsEnrolledCount: number;
  description: string;
  whatYouLearn: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
  includes: string[];
  features: CourseFeatureSummary;
  instructor: InstructorBio;
}
