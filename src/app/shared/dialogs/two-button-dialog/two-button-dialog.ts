import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Component({
  selector: 'app-two-button-dialog',
  templateUrl: './two-button-dialog.html',
  imports: [CommonModule]
})
export class TwoButtonDialog {
  constructor(
    public dialogRef: MatDialogRef<TwoButtonDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}