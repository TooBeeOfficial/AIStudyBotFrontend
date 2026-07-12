import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { UserService } from '../../services/user';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { RouteServices } from '../../route-services';
import { QuestionModel } from '../../../models/questionModel';
import { QuizModel } from '../../../models/quizModel';
import { ChatOperationServices } from '../../chat-operation-services';
import { ExportServices } from '../../services/export-services';
import { QuizService } from '../../services/quiz';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, AsyncPipe, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  exportService: ExportServices = inject(ExportServices);
  quizService: QuizService = inject(QuizService);
  userService: UserService = inject(UserService);

  showProfileDropdown: boolean = false;
  menuOpen: boolean = false;

  filteredQuestions: QuizModel = new QuizModel();
  forExportQuestions: QuestionModel[] = [];
  showExportScreen: boolean = false;
  quizFormOpen: boolean = false;
  maxQuestions: number = 10;
  searchTerm: string = '';
  mode: string = 'end';

  @ViewChild('quizOptions') quizOpts!: ElementRef;
  isMobile = signal(window.innerWidth < 850);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 850);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.profile-dropdown') && !target.closest('button')) {
      this.showProfileDropdown = false;
    }
    if (!target.closest('.extraForms') && !target.closest('.export-button')) {
      this.showExportScreen = false;
      this.quizFormOpen = false;
    }
  }

  openDropDownMenu() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  logoutUser() {
    this.userService.logout().subscribe({
      next: () => {
        this.navigationService.navigateTo('/login');
      },
      error: (err) => {},
    });
  }
  takeQuiz() {
    this.navigationService.navigateTo(RouteServices.routes.takeQuiz, {
      maxQuestions: this.maxQuestions,
      mode: this.mode,
    });
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
}
