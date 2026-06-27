import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from '../../shared/Components/side-bar/side-bar';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { QuizService } from '../../shared/services/quiz';
import { take } from 'rxjs';
import { QuestionCard } from '../../shared/Components/question-card/question-card';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExportServices } from '../../shared/services/export-services';
import { QuestionModel } from '../../models/questionModel';
import { QuizModel } from '../../models/quizModel';

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon, SideBar, QuestionCard, AsyncPipe, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  exportService: ExportServices = inject(ExportServices);
  quizService: QuizService = inject(QuizService);
  router = inject(Router);

  filteredQuestions: QuizModel = new QuizModel();
  forExportQuestions: QuestionModel[] = [];
  showExportScreen: boolean = false;
  quizFormOpen: boolean = false;
  maxQuestions: number = 10;
  menuOpen: boolean = true;
  searchTerm: string = '';
  mode: string = 'end';

  @ViewChild('quizOptions') quizOpts!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.extraForms') && !target.closest('.export-button')) {
      this.showExportScreen = false;
      this.quizFormOpen = false;
    }
  }

  getFilteredQuestions() {
    const keywords = this.searchTerm
      .toLowerCase()
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    this.quizService.quiz$.subscribe({
      next: (quiz) => {
        if (!quiz?.questions) return;

        this.filteredQuestions.questions = quiz.questions.filter((q) => {
          const text = q.question.toLowerCase();

          return keywords.some((keyword) => text.includes(keyword));
        });
      },
    });
  }

  handleExportList(question: QuestionModel, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (this.forExportQuestions.find((q) => q.id == question.id) === undefined)
        this.forExportQuestions.push(question);
    } else {
      this.forExportQuestions = this.forExportQuestions.filter((q) => q.id != question.id);
    }
  }

  exportQuizAsPDF() {
    if (this.forExportQuestions.length > 0) {
      this.exportService.exportQuizPdf(new QuizModel(this.forExportQuestions));
      this.forExportQuestions = [];
    } else {
      this.quizService.quiz$
        .subscribe({
          next: (currentQuiz) => {
            if (!currentQuiz) return;
            this.exportService.exportQuizPdf(currentQuiz);
          },
        })
        .unsubscribe();
    }
  }

  exportQuizAsDOC() {
    if (this.forExportQuestions.length > 0) {
      this.exportService.exportQuizDoc(new QuizModel(this.forExportQuestions));
      this.forExportQuestions = [];
    } else {
      this.quizService.quiz$
        .subscribe({
          next: (currentQuiz) => {
            if (!currentQuiz) return;
            this.exportService.exportQuizDoc(currentQuiz);
          },
        })
        .unsubscribe();
    }
  }

  home() {
    this.navigationService.navigateTo(RouteServices.routes.home);
  }

  ngOnInit(): void {
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;

        this.quizService.getQuizFromChat(currentChat.id).subscribe((res) => {
          this.quizService.setQuiz(res);
        });
      },
    });
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  swapNewQuiz(chatId: number) {
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;

        this.quizService
          .getQuizFromChat(chatId)
          .pipe(take(1))
          .subscribe((res) => {
            this.quizService.setQuiz(res);
          });
      },
    });
  }

  takeQuiz() {
    this.navigationService.navigateTo(RouteServices.routes.takeQuiz, {
      maxQuestions: this.maxQuestions,
      mode: this.mode,
    });
  }
}
