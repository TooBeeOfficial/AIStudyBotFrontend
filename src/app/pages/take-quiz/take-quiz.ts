import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { QuizService } from '../../shared/services/quiz';
import { QuestionModel } from '../../models/questionModel';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../shared/dialogs/success-dialog/success-dialog';
import { MatIcon } from '@angular/material/icon';
import { RouteServices } from '../../shared/route-services';
import { QuestionsService } from '../../shared/services/questions';
import { firstValueFrom } from 'rxjs';

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

  questionService: QuestionsService = inject(QuestionsService);
  routeService: RouteServices = inject(RouteServices);
  quizService: QuizService = inject(QuizService);
  dialog: MatDialog = inject(MatDialog);

  currentQuestion: QuestionModel = new QuestionModel();
  myQuiz: QuestionModel[] = [];

  finish: boolean = false;

  totalCorrectAnswer: number = 0;
  questionsFinished: number = 0;
  selectedAnswer: number = -1;
  isCorrectAnswerID: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const state = history.state.quiz;
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
    }
  }

  checkCorrectAnswer(onComplete: () => void) {
    const questionBeingChecked = this.currentQuestion;
    const answerBeingChecked = this.currentQuestion.answers[this.selectedAnswer];

    this.questionService
      .questionCheckCorrect(questionBeingChecked.id, answerBeingChecked.id)
      .subscribe({
        next: (res) => {
          this.isCorrectAnswerID = res as number;

          if ((res as number) === answerBeingChecked.id) {
            this.totalCorrectAnswer += 1;
          }
          // selectedAnswer no longer reset here — moved to the advance step in getNextQuestion
          onComplete();
        },
        error: (err) => {
          console.error('Failed to check answer', err);
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Error!',
              message: `Something went wrong checking your answer. Please try again.`,
            },
          });
        },
      });
  }

  getNextQuestion() {
    if (this.selectedAnswer === -1 && !this.showResults) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Fail!',
          message: `Please select an answer!`,
        },
      });
      return;
    }

    // Immediate-feedback mode: first click reveals the answer, second click advances
    if (!this.showResultsOnEnd && !this.showResults) {
      this.checkCorrectAnswer(() => {
        this.showResults = true;
      });
      return;
    }

    // End-of-quiz mode: check and advance in the same click
    if (this.showResultsOnEnd) {
      this.checkCorrectAnswer(() => this.advanceToNextQuestion());
    } else {
      this.advanceToNextQuestion();
    }
  }

  private advanceToNextQuestion() {
    this.showResults = false;
    this.isCorrectAnswerID = null;
    this.selectedAnswer = -1;

    if (this.questionsFinished + 1 < this.myQuiz.length) {
      this.questionsFinished += 1;
    } else {
      this.finish = true;
    }

    this.currentQuestion = this.myQuiz[this.questionsFinished];
  }

  setSelectedAnswer(index: number) {
    this.selectedAnswer = index;
  }

  getPercentOfResult() {
    const numberOfQuestions =
      this.maxQuestionsForQuiz === -1 ? this.myQuiz.length : this.maxQuestionsForQuiz;
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
