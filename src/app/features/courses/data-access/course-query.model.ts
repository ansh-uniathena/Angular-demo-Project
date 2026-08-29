import { Course } from '../../../shared/models/course.model';
import { CourseFilters } from './course-filters.model';

export type CourseSort = 'newest' | 'price-asc' | 'price-desc' | 'rating';
export type CourseView = 'grid' | 'list';

export interface CourseListRequest {
  page: number;
  pageSize: number;
  search?: string;
  sort?: CourseSort;
  categoryIds?: string[];
  levelIds?: string[];
  priceOptionId?: string;
}

export interface CourseListResponse {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
  filters: CourseFilters;
}

export interface CommentRequest {
  name: string;
  email: string;
  subject: string;
  comment: string;
}
