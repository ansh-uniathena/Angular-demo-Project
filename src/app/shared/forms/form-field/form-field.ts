import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Icon, IconName } from '../../ui/icon/icon';
import { getFieldErrorMessage } from '../form-error.util';

@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField implements ControlValueAccessor, OnInit {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'textarea'>('text');
  readonly icon = input<IconName | null>(null);
  readonly placeholder = input('');
  readonly required = input(false);
  readonly rows = input(4);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly formTick = signal(0);

  // A signal, not a plain field: writeValue() is invoked externally by the
  // Forms machinery (e.g. form.reset()), not from this component's own
  // template — under OnPush, a plain-field mutation from outside never
  // triggers a re-render, but a signal write does.
  protected readonly value = signal('');
  protected disabled = false;
  protected readonly passwordVisible = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.ngControl?.control?.events.subscribe(() => this.formTick.update((n) => n + 1));
  }

  protected readonly inputType = computed(() => {
    if (this.type() !== 'password') return this.type();
    return this.passwordVisible() ? 'text' : 'password';
  });

  protected readonly showError = computed(() => {
    this.formTick();
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.touched || control.dirty);
  });

  protected readonly errorMessage = computed(() => {
    this.formTick();
    return getFieldErrorMessage(this.ngControl?.control?.errors ?? null, this.label());
  });

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
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
