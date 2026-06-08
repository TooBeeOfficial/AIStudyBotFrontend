import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-question-builder-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-new-question.html',
})
export class QuestionBuilderDialogComponent {
  question = '';
  answers = ['', '', '', ''];
  correctIndex: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<QuestionBuilderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    if (this.correctIndex === null) return;

    const correctAnswer = this.answers[this.correctIndex];

    const result = {
      questions: [
        {
          question: this.question,
          answers: this.answers,
          correct: correctAnswer
        }
      ]
    };

    this.dialogRef.close(result);
  }
}