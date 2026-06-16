import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { QuestionModel } from '../../../models/questionModel';

@Component({
  selector: 'app-question-card',
  imports: [MatIcon],
  templateUrl: './question-card.html',
  styleUrl: './question-card.css',
})
export class QuestionCard {
  showAnswer: boolean = true;
  @Input() question?:QuestionModel
  @Input() isForQuiz: boolean = false;
}
