import { Course } from '../../../shared/models/course.model';

export type EnrollmentStatus = 'active' | 'completed';

/** "Enrolled" isn't a status of its own — every course here is enrolled; active/completed partitions that set. */
export interface EnrolledCourse extends Course {
  enrollmentStatus: EnrollmentStatus;
}

export type EnrolledCoursesFilter = 'enrolled' | 'active' | 'completed';
