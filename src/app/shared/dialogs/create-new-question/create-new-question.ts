import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerTableModel } from '../../../models/answerTableModel';
import { QuestionModel } from '../../../models/questionModel';
import { AnswerModel } from '../../../models/answerModel';

@Component({
  selector: 'app-question-builder-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-new-question.html',
})
export class QuestionBuilderDialogComponent {
  question: QuestionModel = new QuestionModel(
    -1,
    '',
    new AnswerModel(-1, -1, ''),
    new AnswerTableModel(Array.from({ length: 4 }, () => new AnswerModel(-1, -1, ''))),
  );
  correctIndex: number = 0;

  getIfValidQuestion(): boolean {
    if (this.question.question === '' || this.correctIndex === null) {
      return false;
    }
    for (let index = 0; index < this.question.answerTable.answers.length; index++) {
      if (this.question.answerTable.answers[index].answer === '') {
        return false;
      }
    }

    return true;
  }

  constructor(
    private dialogRef: MatDialogRef<QuestionBuilderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  submit() {
    if (this.correctIndex === null) return;

    const correctAnswer = this.question.answerTable.answers[this.correctIndex];
    const result = {
      question: this.question,
      answers: this.question.answerTable.answers,
      correct: correctAnswer,
    };

    this.dialogRef.close(result);
  }

  setCorrectIndex(index:number){
    this.correctIndex = index
  }
}
