import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { PasswordStrengthMeter } from '../../../shared/forms/password-strength-meter/password-strength-meter';
import { passwordStrengthValidator, passwordsMatchValidator } from '../../../shared/forms/validators';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-set-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormField, PasswordStrengthMeter, Button, Alert],
  templateUrl: './set-password.page.html',
  styleUrl: './set-password.page.scss',
})
export class SetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly passwordValue = signal('');

  protected readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ['', [Validators.required, passwordsMatchValidator('password')]],
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
    this.errorMessage.set(null);
    this.submitting.set(true);
    this.auth
      .setPassword(this.form.getRawValue().password)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/auth/login'),
        error: (error: unknown) => this.errorMessage.set(toUserMessage(error)),
      });
  }
}
