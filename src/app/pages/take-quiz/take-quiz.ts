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
  dialog: MatDialog = inject(MatDialog);

  currentQuestion: QuestionModel = new QuestionModel();
  myQuiz: QuestionModel[] = [];

  showResultsOnEnd: boolean = false;
  showResults: boolean = false;
  finish: boolean = false;

  totalCorrectAnswer: number = 0;
  questionsFinished: number = 0;
  selectedAnswer: number = -1;
  maxQuestionsForQuiz: number = 3;

  ngOnInit(): void {
    this.quizService.quiz$.subscribe({
      next: (quiz) => {
        if (!quiz) return;
        this.currentQuestion = quiz.questions[0];
        if (this.maxQuestionsForQuiz === -1 && this.maxQuestionsForQuiz >= quiz.questions.length) {
          this.myQuiz = quiz.questions;
        } else {
          this.myQuiz = this.getRandomItems(quiz.questions, this.maxQuestionsForQuiz);
        }
      },
    });
  }

  // fisher-yates shuffle
  // gets requested amount of questions from given array
  // shuffles list then returns first 10 questions
  getRandomItems<QuestionModel>(
    questions: QuestionModel[],
    numberOfQuestions: number,
  ): QuestionModel[] {
    const copy = [...questions];

    // swap
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy.slice(0, numberOfQuestions);
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
      if (!this.showResultsOnEnd) {
        this.showResults = true;
      }
      if (this.checkCorrectAnswer(this.currentQuestion.answers[this.selectedAnswer].id)) {
        this.totalCorrectAnswer += 1;
      }
    }
  }

  getNextQuestion() {
    if (this.selectedAnswer === -1) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Fail!',
          message: `Please select an answer!`,
        },
      });
      return;
    }
    this.showResults = false;
    this.selectedAnswer = -1;

    if (this.questionsFinished + 1 < this.myQuiz.length) {
      this.questionsFinished += 1;
    } else {
      this.finish = true;
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
