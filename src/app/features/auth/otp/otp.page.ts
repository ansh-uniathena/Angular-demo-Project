import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, interval } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { toUserMessage } from '../../../core/error-handling/app-error';
import { OtpInput } from '../../../shared/forms/otp-input/otp-input';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';

const RESEND_COOLDOWN_SECONDS = 599; // 09:59, matches the mockup

@Component({
  selector: 'app-otp-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, OtpInput, Button, Alert, Icon],
  templateUrl: './otp.page.html',
  styleUrl: './otp.page.scss',
})
export class OtpPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal(false);
  protected readonly resending = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly secondsRemaining = signal(RESEND_COOLDOWN_SECONDS);
  protected readonly maskedEmail = this.auth.maskedEmail;

  protected readonly canResend = computed(() => this.secondsRemaining() === 0);
  protected readonly timerLabel = computed(() => {
    const total = this.secondsRemaining();
    const mm = String(Math.floor(total / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  });

  protected readonly form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.secondsRemaining.update((s) => Math.max(s - 1, 0)));
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.submitting.set(true);
    this.auth
      .verifyOtp(this.form.getRawValue().otp)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/auth/set-password'),
        error: (error: unknown) => this.errorMessage.set(toUserMessage(error)),
      });
  }

  protected resend(): void {
    if (!this.canResend() || this.resending()) return;
    this.resending.set(true);
    this.auth
      .resendOtp()
      .pipe(finalize(() => this.resending.set(false)))
      .subscribe({
        next: () => this.secondsRemaining.set(RESEND_COOLDOWN_SECONDS),
        error: (error: unknown) => this.errorMessage.set(toUserMessage(error)),
      });
  }
}
