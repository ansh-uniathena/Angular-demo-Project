import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { Icon } from '../../../shared/ui/icon/icon';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';
import { FormField } from '../../../shared/forms/form-field/form-field';
import { StudentProfileStore } from '../data-access/student-profile.store';

@Component({
  selector: 'app-student-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StudentProfileStore],
  imports: [ReactiveFormsModule, Spinner, ErrorState, Icon, Alert, Button, FormField],
  templateUrl: './student-profile.page.html',
  styleUrl: './student-profile.page.scss',
})
export class StudentProfilePage {
  protected readonly store = inject(StudentProfileStore);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    gender: ['Male'],
    bio: [''],
  });

  constructor() {
    this.store.load();
    // Populate the form the moment profile data arrives or edit mode opens —
    // never in the constructor (data isn't loaded yet at that point).
    effect(() => {
      const profile = this.store.data();
      const editing = this.store.editing();
      if (profile && editing) {
        untracked(() =>
          this.form.reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            gender: profile.gender,
            bio: profile.bio,
          }),
        );
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.save(this.form.getRawValue());
  }
}
