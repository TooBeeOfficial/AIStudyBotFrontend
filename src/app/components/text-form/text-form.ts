import { Component, ContentChild, Input, OnInit, contentChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from '../../shared/error-service';
import { ShowErrorDirective } from '../../shared/show-error.directive';

@Component({
  selector: 'app-text-form',
  imports: [ReactiveFormsModule],
  templateUrl: './text-form.html',
  styleUrl: './text-form.css',
})
export class TextForm {
  @ContentChild(ShowErrorDirective, { static: true })
  errorDirective!: ShowErrorDirective;

  constructor(private errorService: ErrorService) {}

  @Input() textForm!: FormControl;
  @Input() formName: string = 'default';
  error: string = '';
  ObjectKeys = Object.keys;

  get errorMessage(): string | null {
    const errors = Object.entries(this.textForm.errors || {});

    if (!this.textForm.dirty && !this.textForm.touched) {
      return '';
    }

    if (!errors.length) {
      return null;
    }

    return this.errorService.getErrorValidationMessage(this.formName, errors);
  }

  getErrorMessage(key: string): string {
    switch (key) {
      case 'required':
        return `${this.formName} is required`;

      case 'email':
        return 'Please enter a valid email address';

      case 'passwor':
        return 'Please enter a valid email address';

      case 'minlength':
        const error = this.form.errors?.['minlength'];
        return `Minimum length is ${error.requiredLength}`;

      case 'maxlength':
        const maxError = this.form.errors?.['maxlength'];
        return `Maximum length is ${maxError.requiredLength}`;

      default:
        return 'Must include uppercase, lowercase, and number';
    }
  }

  get form() {
    return this.textForm;
  }
  get name() {
    return this.textForm;
  }
}
