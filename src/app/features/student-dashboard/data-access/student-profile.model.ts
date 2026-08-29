export interface StudentProfile {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  gender: string;
  dobLabel: string;
  age: number;
  bio: string;
  registeredAtLabel: string;
}

export type StudentProfileUpdateRequest = Pick<
  StudentProfile,
  'firstName' | 'lastName' | 'phone' | 'gender' | 'bio'
>;
