export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: CourseLevel;
  thumbnailUrl: string;
  price: number | null; // null => free
  originalPrice: number | null;
  instructorId: string;
  instructorName: string;
  instructorAvatarUrl: string;
  lessonCount: number;
  durationLabel: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  trending: boolean;
}
