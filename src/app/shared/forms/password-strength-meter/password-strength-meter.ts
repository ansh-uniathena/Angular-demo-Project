import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { calculatePasswordStrength } from '../password-strength';

const LEVEL_CLASS = ['empty', 'weak', 'fair', 'good', 'strong'] as const;

@Component({
  selector: 'app-password-strength-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="strength-meter" role="presentation">
      @for (filled of segments(); track $index) {
        <span class="strength-meter__bar" [class]="'strength-meter__bar--' + (filled ? level() : 'empty')"></span>
      }
    </div>
  `,
  styleUrl: './password-strength-meter.scss',
})
export class PasswordStrengthMeter {
  readonly value = input('');

  protected readonly strength = computed(() => calculatePasswordStrength(this.value()));
  protected readonly level = computed(() => LEVEL_CLASS[this.strength()]);
  protected readonly segments = computed(() => {
    const strength = this.strength();
    return Array.from({ length: 4 }, (_, i) => i < strength);
  });
}
