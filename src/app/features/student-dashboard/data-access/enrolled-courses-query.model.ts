import { Course } from '../../../shared/models/course.model';
import { EnrolledCoursesFilter } from './enrolled-course.model';

export interface EnrolledCoursesRequest {
  filter: EnrolledCoursesFilter;
  page: number;
  pageSize: number;
}

export interface EnrolledCoursesResponse {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<EnrolledCoursesFilter, number>;
}
