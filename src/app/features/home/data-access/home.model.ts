import { Course } from '../../../shared/models/course.model';
import { Instructor } from '../../../shared/models/instructor.model';

export interface Category {
  id: string;
  name: string;
  iconUrl: string;
  instructorCount: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorPhotoUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}

export interface SiteStats {
  onlineCourses: string;
  expertTutors: string;
  certifiedCourses: string;
  onlineStudents: string;
  studentsEnrolled: string;
  totalCourses: string;
  countries: string;
}

export interface HomePageData {
  categories: Category[];
  courses: Course[];
  instructors: Instructor[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  stats: SiteStats;
}
