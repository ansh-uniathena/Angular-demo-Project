import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

const OTP_LENGTH = 4;

/** Fixed-length 4-digit segmented OTP input. Not built for a variable length — no known use case needs one. */
@Component({
  selector: 'app-otp-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
})
export class OtpInput implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  protected readonly indices = Array.from({ length: OTP_LENGTH }, (_, i) => i);
  protected readonly digits = signal<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));
  protected disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  protected onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    input.value = digit;
    this.digits.update((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    this.onChange(this.digits().join(''));
    if (digit && index < OTP_LENGTH - 1) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    }
  }

  protected handleFocus(): void {
    this.onTouched();
  }

  writeValue(value: string | null): void {
    const chars = (value ?? '').split('');
    this.digits.set(Array.from({ length: OTP_LENGTH }, (_, i) => chars[i] ?? ''));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
