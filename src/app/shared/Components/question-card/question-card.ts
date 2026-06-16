import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-question-card',
  imports: [MatIcon],
  templateUrl: './question-card.html',
  styleUrl: './question-card.css',
})
export class QuestionCard {
  showAnswer: boolean = true;
  @Input() isForQuiz: boolean = false;
}
