import { User } from '../../shared/models/user.model';

interface MockUserRecord {
  user: User;
  password: string;
}

/**
 * Demo credentials — seeded to match the Lock Screen mockup exactly.
 * email: ronald.richard@example.com / password: Dreams@123
 */
export const mockUsers: MockUserRecord[] = [
  {
    user: {
      id: 'usr_1',
      name: 'Ronald Richard',
      email: 'ronald.richard@example.com',
      role: 'student',
      avatarUrl: 'https://i.pravatar.cc/150?img=13',
    },
    password: 'Dreams@123',
  },
];

/** Fixed OTP for the demo — there is no real email delivery to verify against. */
export const DEMO_OTP = '1234';

/** email -> in-flight password-reset state, cleared once set-password succeeds. */
export const pendingResets = new Map<string, { otpVerified: boolean; resetToken: string }>();

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(-3);
  return `${'*'.repeat(Math.max(local.length - 3, 3))}${visible}@${domain}`;
}

export function findUserByEmail(email: string): MockUserRecord | undefined {
  return mockUsers.find((record) => record.user.email.toLowerCase() === email.toLowerCase());
}
