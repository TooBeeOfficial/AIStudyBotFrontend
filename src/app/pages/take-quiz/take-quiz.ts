import { Component, inject, Input, OnInit } from '@angular/core';
import { QuizService } from '../../shared/services/quiz';
import { QuestionModel } from '../../models/questionModel';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../shared/dialogs/success-dialog/success-dialog';
import { MatIcon } from '@angular/material/icon';
import { RouteServices } from '../../shared/route-services';

@Component({
  selector: 'app-take-quiz',
  imports: [NgClass, MatIcon],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.css',
})
export class TakeQuiz implements OnInit {
  @Input() showResultsOnEnd: boolean = true;
  @Input() showResults: boolean = false;
  @Input() maxQuestionsForQuiz: number = 2;

  routeService: RouteServices = inject(RouteServices);
  quizService: QuizService = inject(QuizService);
  dialog: MatDialog = inject(MatDialog);

  currentQuestion: QuestionModel = new QuestionModel();
  myQuiz: QuestionModel[] = [];

  finish: boolean = false;

  totalCorrectAnswer: number = 0;
  questionsFinished: number = 0;
  selectedAnswer: number = -1;

  ngOnInit(): void {
    const state = history.state.quiz;
    console.log(state.maxQuestions);
    this.quizService.quiz$.subscribe({
      next: (quiz) => {
        if (!quiz) return;
        this.maxQuestionsForQuiz = state.maxQuestions;
        if (state.mode !== 'end') {
          this.showResultsOnEnd = false;
        }
        if (this.maxQuestionsForQuiz === -1 && this.maxQuestionsForQuiz >= quiz.questions.length) {
          this.myQuiz = quiz.questions;
        } else {
          this.myQuiz = this.getRandomItems(quiz.questions, this.maxQuestionsForQuiz);
        }
        this.currentQuestion = this.myQuiz[0];
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

  getPercentOfResult() {
    const numberOfQuestions =
      this.maxQuestionsForQuiz === -1 ? this.myQuiz.length : this.maxQuestionsForQuiz;
    console.log((this.totalCorrectAnswer / numberOfQuestions) * 100);
    return (this.totalCorrectAnswer / numberOfQuestions) * 100;
  }

  retryTest() {
    this.quizService.quiz$.subscribe({
      next: (quiz) => {
        if (!quiz) return;
        this.currentQuestion = quiz.questions[0];
        if (this.maxQuestionsForQuiz === -1 && this.maxQuestionsForQuiz >= quiz.questions.length) {
          this.myQuiz = quiz.questions;
        } else {
          this.myQuiz = this.getRandomItems(quiz.questions, this.maxQuestionsForQuiz);
        }
        this.currentQuestion = this.myQuiz[0];
        this.finish = false;
        this.questionsFinished = 0;
        this.totalCorrectAnswer = 0;
        this.selectedAnswer = -1;
      },
    });
  }

  endTest() {
    this.routeService.navigateTo(RouteServices.routes.quiz);
  }
}
