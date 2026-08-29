import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { PasswordStrengthMeter } from '../../../shared/forms/password-strength-meter/password-strength-meter';
import { passwordStrengthValidator, passwordsMatchValidator } from '../../../shared/forms/validators';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';
import { SocialAuthButtons } from '../ui/social-auth-buttons/social-auth-buttons';

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormField,
    PasswordStrengthMeter,
    Button,
    Alert,
    SocialAuthButtons,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly passwordValue = signal('');

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ['', [Validators.required, passwordsMatchValidator('password')]],
    agreeToTerms: [false, [Validators.requiredTrue]],
  });

  constructor() {
    this.form.controls.password.valueChanges.subscribe((value) => {
      this.passwordValue.set(value);
      this.form.controls.confirmPassword.updateValueAndValidity({ onlySelf: true });
    });
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, email, password } = this.form.getRawValue();
    this.errorMessage.set(null);
    this.submitting.set(true);
    this.auth
      .register({ fullName, email, password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (error: unknown) => this.errorMessage.set(toUserMessage(error)),
      });
  }
}
