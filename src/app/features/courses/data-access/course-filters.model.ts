export interface FilterOption {
  id: string;
  label: string;
  count: number;
}

export interface CourseFilters {
  categories: FilterOption[];
  instructors: FilterOption[];
  priceOptions: FilterOption[]; // all / free / paid
  levels: FilterOption[];
  priceRange: { min: number; max: number };
}
