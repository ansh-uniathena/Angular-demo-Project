import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-lock-screen-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormField, Button, Alert],
  templateUrl: './lock-screen.page.html',
  styleUrl: './lock-screen.page.scss',
})
export class LockScreenPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly user = this.auth.currentUser;

  protected readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.submitting.set(true);
    this.auth
      .unlock(this.form.getRawValue().password)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (error: unknown) => this.errorMessage.set(toUserMessage(error)),
      });
  }
}
