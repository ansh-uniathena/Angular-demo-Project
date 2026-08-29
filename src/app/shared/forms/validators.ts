import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { calculatePasswordStrength } from './password-strength';

/** Rejects passwords scoring below "fair" (2/4) on the shared strength scale. */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) return null;
    return calculatePasswordStrength(value) < 2 ? { weakPassword: true } : null;
  };
}

/**
 * Attach to the *confirm* control. Reads the sibling password control via
 * `control.parent`, so the error lands on the confirm field itself — right
 * where FormField needs it. Callers must re-run validation on the confirm
 * control whenever the password control changes (see register.page.ts).
 */
export function passwordsMatchValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordControlName)?.value;
    if (password === undefined || !control.value) return null;
    return control.value === password ? null : { passwordMismatch: true };
  };
}
