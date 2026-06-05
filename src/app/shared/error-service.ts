import { Injectable } from '@angular/core';
import { ErrorTypes, ERROR_MESSAGES } from './error-messages';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  getErrorValidationMessage(formControlName: string, errors: [string, any][]): string {
    switch (true) {
      case this.checkErrorType(errors, 'required'):
        return ERROR_MESSAGES['required'](formControlName);

      case this.checkErrorType(errors, 'email'):
        return ERROR_MESSAGES['email']();

      case this.checkErrorType(errors, 'minlength'):
        const minRequirement = this.getErrorMessage(errors, 'minlength')?.requiredLength;
        return ERROR_MESSAGES['minlength'](formControlName, minRequirement);

      case this.checkErrorType(errors, 'maxlength'):
        const maxReq = this.getErrorMessage(errors, "maxlength")?.requiredLength;
        return ERROR_MESSAGES['maxlength'](formControlName, maxReq);
        
      case this.checkErrorType(errors, 'pattern'):
        return ERROR_MESSAGES['pattern']();

      default:
        return '';
    }
  }

  checkErrorType(errors: [string, any][], key: ErrorTypes) {
    return errors.some(([errorKey, value]) => errorKey === key);
  }

  getErrorMessage(errors: [string, any][], key: ErrorTypes) {
    return errors.find(([k, v]) => k === key)?.[1];
  }
}
