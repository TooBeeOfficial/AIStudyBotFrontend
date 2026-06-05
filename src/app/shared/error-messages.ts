import { ValidationErrors } from "@angular/forms";

export type ErrorTypes = keyof ValidationErrors;

export const ERROR_MESSAGES: Record<ErrorTypes, (...args: any[]) => string> = {
  required: (formControlName: string) =>
    `${formControlName} is required.`,

  email: () =>
    `This is not a valid email address.`,

  minlength: (formControlName: string, requirement: number) =>
    `${formControlName} should be at least ${requirement} characters.`,

  maxlength: (formControlName: string, requirement: number) =>
    `${formControlName} should be at most ${requirement} characters.`,

  pattern: (formControlName: string) =>
    `${formControlName} format is invalid.`,

  invalidDate: () =>
    `This is not a valid date.`,

  invalidYear: () =>
    `Date of Birth should be after year 1900.`,
};