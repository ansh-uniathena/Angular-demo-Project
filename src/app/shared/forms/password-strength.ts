/** 0 = empty, 1 = weak … 4 = strong. Shared by the strength-meter UI and the validator below. */
export function calculatePasswordStrength(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}
