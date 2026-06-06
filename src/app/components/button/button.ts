import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  standalone: true,
  imports: [CommonModule],
})
export class Button {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'white' = 'primary';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
