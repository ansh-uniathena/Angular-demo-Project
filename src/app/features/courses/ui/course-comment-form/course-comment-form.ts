import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../../../shared/forms/form-field/form-field';
import { Alert } from '../../../../shared/ui/alert/alert';
import { Button } from '../../../../shared/ui/button/button';
import { CommentRequest } from '../../data-access/course-query.model';

@Component({
  selector: 'app-course-comment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormField, Button, Alert],
  templateUrl: './course-comment-form.html',
  styleUrl: './course-comment-form.scss',
})
export class CourseCommentForm {
  readonly submitting = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly submitted = input(false);
  readonly commentSubmitted = output<CommentRequest>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    comment: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor() {
    // Reset only once the store confirms the mock API accepted it — never
    // clear on submit, or a failed request would silently lose the input.
    effect(() => {
      if (this.submitted()) this.form.reset();
    });
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.commentSubmitted.emit(this.form.getRawValue());
  }
}
