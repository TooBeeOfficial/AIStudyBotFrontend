import { Component, ContentChild, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ErrorService } from '../../../error-service';
import { ShowErrorDirective } from '../../../show-error.directive';

@Component({
  selector: 'app-text-form',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './text-form.html',
  styleUrl: './text-form.css',
})
export class TextForm {
  @ContentChild(ShowErrorDirective, { static: true })
  errorDirective!: ShowErrorDirective;
  showPassword: boolean = false;

  constructor(private errorService: ErrorService) {}

  @Input() textForm!: FormControl;
  @Input() formName: string = 'default';
  @Input() formTextType: string = 'text';
  @Input() showHideButton: boolean = false;
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

      case 'password':
        return 'Please enter a valid passwor';

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

  hidePassword() {
    if (this.showHideButton == false) {
      return;
    }
    if (this.formTextType == 'text') {
      this.formTextType = 'password';
    } else if (this.formTextType == 'password') {
      this.formTextType = 'text';
    }
    this.showPassword = !this.showPassword;
  }

  get form() {
    return this.textForm;
  }
  get name() {
    return this.textForm;
  }
}
