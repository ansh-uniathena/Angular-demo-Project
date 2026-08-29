import { ValidationErrors } from '@angular/forms';

/** Centralized copy for every validator this app uses — one message per error key. */
export function getFieldErrorMessage(errors: ValidationErrors | null, label: string): string | null {
  if (!errors) return null;
  if (errors['required']) return `${label} is required.`;
  if (errors['email']) return 'Enter a valid email address.';
  if (errors['minlength']) {
    return `${label} must be at least ${errors['minlength'].requiredLength} characters.`;
  }
  if (errors['weakPassword']) return 'Password is too weak — mix upper/lowercase, a number and a symbol.';
  if (errors['passwordMismatch']) return 'Passwords do not match.';
  if (errors['pattern']) return `${label} format is invalid.`;
  if (errors['requiredTrue']) return `You must accept the ${label}.`;
  return `${label} is invalid.`;
}
