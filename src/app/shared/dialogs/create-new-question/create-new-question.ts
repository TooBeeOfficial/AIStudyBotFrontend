import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerTableModel } from '../../../models/answerTableModel';
import { QuestionModel } from '../../../models/questionModel';
import { AnswerModel } from '../../../models/answerModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-builder-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-new-question.html',
})
export class QuestionBuilderDialogComponent {
  question: QuestionModel = new QuestionModel(
    -1,
    '',
    new AnswerModel(-1, -1, ''),
    new AnswerTableModel(Array.from({ length: 4 }, () => new AnswerModel(-1, -1, ''))),
  );
  correctIndex: number = -1;
  errorMessage: string = '';
  formControl: FormControl = new FormControl();

  getIfValidQuestion(displayError: boolean): boolean {
    if (this.question.question === '') {
      if (displayError) this.errorMessage = 'Please enter a question.';
      return false;
    }

    if (this.correctIndex === -1) {
      if (displayError) this.errorMessage = 'Please choose the correct answer.';
      return false;
    }

    // No empty answers
    for (let index = 0; index < this.question.answerTable.answers.length; index++) {
      if (this.question.answerTable.answers[index].answer === '') {
        if (displayError) this.errorMessage = 'Please fill in all answers.';
        return false;
      }
    }

    // no duplicate answers.
    for (let i = 0; i < this.question.answerTable.answers.length; i++) {
      let count = 0;

      for (let j = 0; j < this.question.answerTable.answers.length; j++) {
        if (
          this.question.answerTable.answers[i].answer ===
          this.question.answerTable.answers[j].answer
        ) {
          count++;
        }
      }

      if (count > 1) {
        if (displayError) this.errorMessage = 'All answers must be unique.';
        return false;
      }
    }
    this.errorMessage = '';
    return true;
  }

  constructor(
    private dialogRef: MatDialogRef<QuestionBuilderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  submit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    // no duplicate answers.
    for (let i = 0; i < this.question.answerTable.answers.length; i++) {
      let count = 0;

      for (let j = 0; j < this.question.answerTable.answers.length; j++) {
        if (
          this.question.answerTable.answers[i].answer ===
          this.question.answerTable.answers[j].answer
        ) {
          count++;
        }
      }

      if (count > 1) {
        this.errorMessage = 'All answers must be unique.';
        return;
      }
    }

    // Correct answer check
    if (this.correctIndex === -1) {
      this.errorMessage = 'Please choose the correct answer.';
      return;
    }

    const correctAnswer = this.question.answerTable.answers[this.correctIndex];

    const result = {
      question: this.question,
      answers: this.question.answerTable.answers,
      correct: correctAnswer,
    };

    this.dialogRef.close(result);
  }

  setCorrectIndex(index: number) {
    this.correctIndex = index;
  }
}
