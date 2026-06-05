import { Directive, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: 'input[showError], textarea[showError], select[showError]',
})
export class ShowErrorDirective {
  @Input() controlName?: string; 
  constructor(@Optional() @Self() public ngControl: NgControl) {}
}