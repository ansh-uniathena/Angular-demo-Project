import { Course } from '../../../shared/models/course.model';
import { CourseDetail } from './course-detail.model';
import { mockCourses } from './course.mock-data';

/**
 * Full curriculum/instructor-bio content, transcribed exactly from
 * Ui-Image/Course Detail 3.jpg — the richest of the two provided detail
 * mockups (Course Detail 4.jpg differs only in hero layout, not content;
 * see CLAUDE.md §1). Only this seed course carries hand-authored detail
 * content; every other catalog course gets a generated detail below so
 * every /courses/:slug still resolves.
 */
const SEED_DETAIL: CourseDetail = {
  ...(mockCourses.find((c) => c.slug === 'complete-web-developer-course-2') as Course),
  heroImageUrl: '/Course Image (2).png',
  discountLabel: '50% off',
  studentsEnrolledCount: 32,
  description:
    'Embark on a transformative journey into AI with Mike Wheeler, your guide in this Udemy Best Seller course on ChatGPT and Prompt Engineering. As an experience instructor who has taught well over 300,000 students, Mike unveils the secrets of developing your own custom GPTs, ensuring your skills shine in the thriving digital marketplace.\n\nThis course will get your familiar with Generative AI and the effective use of ChatGPT and is perfect for the beginner. You will also learn advanced prompting techniques to take your Prompt Engineering skills to the next level!',
  whatYouLearn: [
    'Become a UX designer.',
    'You will be able to add UX designer to your CV',
    'Become a UI designer.',
    'Build & test a full website design.',
    'Build & test a full mobile app.',
  ],
  requirements: [
    'You will need a copy of Adobe XD 2019 or above. A free trial can be downloaded from Adobe.',
    'No previous design experience is needed.',
    'No previous Adobe XD skills are needed.',
  ],
  curriculum: [
    {
      id: 'sec_getting_started',
      title: 'Getting Started',
      lectures: [
        { id: 'lec_1_1', title: 'Introduction to the User Experience Course', durationLabel: '02:53', preview: true },
        { id: 'lec_1_2', title: 'Exercise: Your first design challenge', durationLabel: '02:53', preview: true },
        { id: 'lec_1_3', title: 'How to solve the previous exercise', durationLabel: '02:53', preview: true },
        { id: 'lec_1_4', title: 'Find out why smart objects are amazing', durationLabel: '02:53', preview: true },
        { id: 'lec_1_5', title: 'How to use text layers effectively', durationLabel: '02:53', preview: true },
      ],
    },
    {
      id: 'sec_the_brief',
      title: 'The Brief',
      lectures: [
        { id: 'lec_2_1', title: 'Reading the client brief', durationLabel: '04:12', preview: false },
        { id: 'lec_2_2', title: 'Turning requirements into wireframes', durationLabel: '05:30', preview: false },
      ],
    },
    {
      id: 'sec_wireframing',
      title: 'Wireframing Low Fidelity',
      lectures: [
        { id: 'lec_3_1', title: 'Sketching low-fidelity screens', durationLabel: '06:45', preview: false },
        { id: 'lec_3_2', title: 'Reviewing wireframes with stakeholders', durationLabel: '03:58', preview: false },
      ],
    },
    {
      id: 'sec_type_color_icon',
      title: 'Type, Color & Icon Introduction',
      lectures: [
        { id: 'lec_4_1', title: 'Choosing a type scale', durationLabel: '05:02', preview: false },
        { id: 'lec_4_2', title: 'Building a color palette', durationLabel: '04:47', preview: false },
        { id: 'lec_4_3', title: 'Icon systems and consistency', durationLabel: '06:10', preview: false },
      ],
    },
  ],
  includes: [
    '11 hours on-demand video',
    '69 downloadable resources',
    'Full lifetime access',
    'Access on mobile and TV',
    'Assignments',
    'Certificate of Completion',
  ],
  features: {
    enrolledLabel: 'Enrolled: 32 students',
    durationLabel: 'Duration: 20 hours',
    chaptersCount: 15,
    videoDurationLabel: 'Video: 12 hours',
    level: 'Beginner',
  },
  instructor: {
    name: 'Nicole Brown',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    title: 'UX/UI Designer',
    rating: 4.5,
    reviewCount: 0,
    courseCount: 5,
    lessonCount: 12,
    durationLabel: '9hr 30min',
    studentsEnrolledLabel: '270,866 students enrolled',
    bio: 'UI/UX Designer, with 7+ Years Experience. Guarantee of High Quality Work.',
    skills: [
      'Web Design',
      'UI Design',
      'UX/UI Design',
      'Mobile Design',
      'User Interface Design',
      'Sketch',
      'Photoshop',
      'GUI',
      'Html',
      'Css',
      'Grid Systems',
      'Typography',
      'Minimal',
      'Template',
      'English',
      'Bootstrap',
      'Responsive Web Design',
      'Pixel Perfect',
      'Graphic Design',
      'Corporate',
      'Creative',
      'Flat',
      'Luxury and much more.',
    ],
    availableFor: ['Full Time Office Work', 'Remote Work', 'Freelance', 'Contract', 'Worldwide'],
  },
};

const GENERIC_INCLUDES = [
  'On-demand video',
  'Downloadable resources',
  'Full lifetime access',
  'Access on mobile and TV',
  'Certificate of Completion',
];

/** Every catalog course that isn't the hand-authored seed gets a lighter, generated detail. */
function buildGenericDetail(course: Course): CourseDetail {
  return {
    ...course,
    heroImageUrl: course.thumbnailUrl,
    discountLabel: course.originalPrice ? '50% off' : null,
    studentsEnrolledCount: 32,
    description: `${course.title} is a ${course.level.toLowerCase()}-level ${course.category.toLowerCase()} course designed to take you from the fundamentals to real, shippable work.`,
    whatYouLearn: [
      `Core concepts behind ${course.category.toLowerCase()}`,
      'Hands-on practice with real project examples',
      'Best practices used by working professionals',
      'How to keep learning after the course ends',
    ],
    requirements: ['A computer with an internet connection.', 'No prior experience required.'],
    curriculum: [
      {
        id: 'sec_getting_started',
        title: 'Getting Started',
        lectures: Array.from({ length: Math.min(course.lessonCount, 5) }, (_, i) => ({
          id: `lec_${i + 1}`,
          title: `Lesson ${i + 1}`,
          durationLabel: '05:00',
          preview: i === 0,
        })),
      },
    ],
    includes: GENERIC_INCLUDES,
    features: {
      enrolledLabel: 'Enrolled: 32 students',
      durationLabel: course.durationLabel,
      chaptersCount: Math.max(1, Math.round(course.lessonCount / 4)),
      videoDurationLabel: course.durationLabel,
      level: course.level,
    },
    instructor: {
      name: course.instructorName,
      avatarUrl: course.instructorAvatarUrl,
      title: `${course.category} Instructor`,
      rating: course.rating,
      reviewCount: course.reviewCount,
      courseCount: 1,
      lessonCount: course.lessonCount,
      durationLabel: course.durationLabel,
      studentsEnrolledLabel: '32 students enrolled',
      bio: `${course.instructorName} teaches ${course.category.toLowerCase()} with a focus on practical, project-based learning.`,
      skills: [course.category],
      availableFor: ['Remote Work'],
    },
  };
}

export function findCourseDetailBySlug(slug: string): CourseDetail | undefined {
  if (slug === SEED_DETAIL.slug) return SEED_DETAIL;
  const course = mockCourses.find((c) => c.slug === slug);
  return course ? buildGenericDetail(course) : undefined;
}
