import { Component, inject, OnInit } from '@angular/core';
import { QuizService } from '../../shared/services/quiz';
import { QuestionModel } from '../../models/questionModel';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../shared/dialogs/success-dialog/success-dialog';

@Component({
  selector: 'app-take-quiz',
  imports: [NgClass],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.css',
})
export class TakeQuiz implements OnInit {
  quizService: QuizService = inject(QuizService);
  myQuiz: QuestionModel[] = [];
  currentQuestion: QuestionModel = new QuestionModel();
  questionsFinished: number = 0;
  showResults: boolean = false;
  selectedAnswer: number = -1;
  dialog: MatDialog = inject(MatDialog);
  totalCorrectAnswer: number = 0;

  ngOnInit(): void {
    this.quizService.quiz$.subscribe({
      next: (quiz) => {
        if (!quiz) return;
        this.currentQuestion = quiz.questions[0];
        this.myQuiz = quiz.questions;
      },
    });
  }

  checkCorrectAnswer(answer: number) {
    if (answer === this.currentQuestion.correctAnswer) {
      return true;
    }
    return false;
  }

  getResult() {
    if (this.selectedAnswer === -1) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Fail!',
          message: `Please select an answer!`,
        },
      });
    } else {
      this.showResults = true;
      if (this.checkCorrectAnswer(this.currentQuestion.answers[this.selectedAnswer].id)) {
        this.totalCorrectAnswer += 1;
      }
    }
  }

  getNextQuestion() {
    this.showResults = false;
    this.selectedAnswer = -1;

    if (this.questionsFinished + 1 < this.myQuiz.length) {
      this.questionsFinished += 1;
    }
    this.currentQuestion = this.myQuiz[this.questionsFinished];
  }

  setSelectedAnswer(index: number) {
    if (this.showResults) {
      return;
    }
    this.selectedAnswer = index;
  }
}
